<?php
// ================================================================
// ENDPOINT: PACIENTES Y FILIACIÓN
// GET  /api/pacientes.php           -> Listar todos los pacientes
// GET  /api/pacientes.php?dni=...   -> Buscar paciente por DNI
// POST /api/pacientes.php           -> Registrar nuevo paciente
// ================================================================

require_once __DIR__ . "/config/cors.php";
require_once __DIR__ . "/config/conexion.php";

$db = Conexion::conectar();
if (!$db) {
    responderJSON(["error" => true, "mensaje" => "No hay conexión a la base de datos."], 503);
}

$metodo = $_SERVER['REQUEST_METHOD'];

// ----------------------------------------------------------------
// 1. CONSULTAR PACIENTES (GET)
// ----------------------------------------------------------------
if ($metodo === 'GET') {
    $dni = isset($_GET['dni']) ? trim($_GET['dni']) : '';

    $sqlBase = "SELECT 
                    p.idpersona AS id,
                    p.idpersona,
                    p.dni,
                    p.nombres,
                    p.apellido_paterno AS ape_paterno,
                    p.apellido_materno AS ape_materno,
                    CONCAT(p.apellido_paterno, ' ', COALESCE(p.apellido_materno, ''), ', ', p.nombres) AS paciente,
                    p.telefono,
                    p.correo,
                    p.fecha_nacimiento,
                    p.genero,
                    p.etnia,
                    TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad,
                    COALESCE(CONCAT(COALESCE(d.nombre_calle, ''), ' ', COALESCE(d.numero_calle, '')), 'Carhuaz') AS domicilio,
                    d.referencia,
                    dist.nombre AS distrito,
                    prov.nombre AS provincia,
                    dep.nombre AS departamento,
                    COALESCE(c.nombre_carrera, 'Enfermería Técnica') AS programa,
                    COALESCE(CONCAT('HC-', hc.numero_historia_clinica), CONCAT('HC-', p.dni)) AS historia_clinica,
                    hc.fecha_apertura AS fecha_registro
                FROM persona p
                LEFT JOIN direccion d ON p.direccion_iddireccion = d.iddireccion
                LEFT JOIN distrito dist ON d.distrito_iddistrito = dist.iddistrito
                LEFT JOIN provincia prov ON dist.provincia_idprovincia = prov.idprovincia
                LEFT JOIN departamento dep ON prov.departamento_iddepartamento = dep.iddepartamento
                LEFT JOIN estudiante est ON est.persona_idpersona = p.idpersona
                LEFT JOIN carrera c ON est.carrera_idcarrera = c.idcarrera
                LEFT JOIN historia_clinica hc ON hc.persona_idpersona = p.idpersona";

    try {
        if (!empty($dni)) {
            $stmt = $db->prepare($sqlBase . " WHERE p.dni = :dni OR p.idpersona = :dni LIMIT 1");
            $stmt->execute([':dni' => $dni]);
            $paciente = $stmt->fetch();

            if ($paciente) {
                responderJSON(["error" => false, "encontrado" => true, "paciente" => $paciente]);
            } else {
                responderJSON(["error" => false, "encontrado" => false, "mensaje" => "Paciente no encontrado"], 404);
            }
        } else {
            $stmt = $db->query($sqlBase . " ORDER BY p.idpersona DESC");
            $pacientes = $stmt->fetchAll();
            responderJSON(["error" => false, "datos" => $pacientes]);
        }
    } catch (PDOException $e) {
        responderJSON(["error" => true, "mensaje" => "Error al consultar: " . $e->getMessage()], 500);
    }
}

// ----------------------------------------------------------------
// 2. REGISTRAR PACIENTE (POST)
// ----------------------------------------------------------------
if ($metodo === 'POST') {
    $datos = obtenerDatosEntrada();

    $dni             = trim($datos['dni'] ?? '');
    $historiaClinica = trim($datos['historiaClinica'] ?? $datos['historia_clinica'] ?? "HC-{$dni}");
    $apePaterno      = trim($datos['apePaterno'] ?? $datos['ape_paterno'] ?? $datos['apellido_paterno'] ?? '');
    $apeMaterno      = trim($datos['apeMaterno'] ?? $datos['ape_materno'] ?? $datos['apellido_materno'] ?? '');
    $nombres         = trim($datos['nombres'] ?? '');
    $fechaNacimiento = trim($datos['fechaNacimiento'] ?? $datos['fecha_nacimiento'] ?? '');
    $genero          = trim($datos['genero'] ?? 'No precisa');
    $etnia           = trim($datos['etnia'] ?? 'Mestizo');
    $programa        = trim($datos['programa'] ?? 'Enfermería Técnica');
    $telefono        = trim($datos['telefono'] ?? '');
    $correo          = trim($datos['correo'] ?? '');
    $domicilio       = trim($datos['domicilio'] ?? '');
    $referencia      = trim($datos['referencia'] ?? '');

    if (empty($dni) || empty($apePaterno) || empty($nombres)) {
        responderJSON(["error" => true, "mensaje" => "DNI, Apellidos y Nombres son obligatorios."], 400);
    }

    try {
        $db->beginTransaction();

        // Verificar si el DNI ya existe en 'persona'
        $check = $db->prepare("SELECT idpersona FROM persona WHERE dni = :dni LIMIT 1");
        $check->execute([':dni' => $dni]);
        if ($check->fetch()) {
            $db->rollBack();
            responderJSON(["error" => true, "mensaje" => "El paciente con DNI $dni ya se encuentra registrado."], 409);
        }

        // Insertar dirección si existe
        $direccionId = null;
        if (!empty($domicilio) || !empty($referencia)) {
            $stmtDir = $db->prepare("INSERT INTO direccion (nombre_calle, referencia, distrito_iddistrito) VALUES (:dom, :ref, 1)");
            $stmtDir->execute([':dom' => $domicilio ?: 'Dirección registrada', ':ref' => $referencia]);
            $direccionId = $db->lastInsertId();
        }

        // Insertar persona
        $stmtPers = $db->prepare("INSERT INTO persona 
            (dni, nombres, apellido_paterno, apellido_materno, telefono, correo, fecha_nacimiento, genero, etnia, direccion_iddireccion) 
            VALUES (:dni, :nom, :apep, :apem, :tel, :corr, :fnac, :gen, :etn, :dir)");
        $stmtPers->execute([
            ':dni'  => $dni,
            ':nom'  => $nombres,
            ':apep' => $apePaterno,
            ':apem' => $apeMaterno,
            ':tel'  => $telefono ?: null,
            ':corr' => $correo ?: null,
            ':fnac' => $fechaNacimiento ?: '2000-01-01',
            ':gen'  => $genero,
            ':etn'  => $etnia,
            ':dir'  => $direccionId
        ]);
        $personaId = $db->lastInsertId();

        // Insertar historia clínica
        $numHist = intval(preg_replace('/\D/', '', $historiaClinica)) ?: (1000 + $personaId);
        $stmtHc = $db->prepare("INSERT INTO historia_clinica (numero_historia_clinica, fecha_apertura, estado, persona_idpersona) VALUES (:num, CURDATE(), 'ACTIVA', :pers)");
        $stmtHc->execute([':num' => $numHist, ':pers' => $personaId]);

        // Insertar estudiante
        $carreraId = (strpos($programa, 'Arquitectura') !== false || strpos($programa, 'Tecnologías') !== false) ? 2 : 1;
        $stmtEst = $db->prepare("INSERT INTO estudiante (periodo_academico, carrera_idcarrera, persona_idpersona, tipo_apoderado_idtipo_apoderado) VALUES ('2026-I', :car, :pers, 1)");
        $stmtEst->execute([':car' => $carreraId, ':pers' => $personaId]);

        $db->commit();

        responderJSON([
            "error" => false,
            "mensaje" => "Paciente registrado exitosamente en la base de datos MySQL.",
            "idpersona" => $personaId,
            "dni" => $dni,
            "historiaClinica" => $historiaClinica
        ], 201);
    } catch (PDOException $e) {
        $db->rollBack();
        responderJSON(["error" => true, "mensaje" => "Error al guardar paciente: " . $e->getMessage()], 500);
    }
}
