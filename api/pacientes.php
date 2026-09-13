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

    try {
        if (!empty($dni)) {
            $stmt = $db->prepare("SELECT * FROM pacientes WHERE dni = :dni LIMIT 1");
            $stmt->execute([':dni' => $dni]);
            $paciente = $stmt->fetch();

            if ($paciente) {
                // Formatear apoderado como subobjeto para compatibilidad con el frontend
                $paciente['apoderado'] = [
                    "dni"       => $paciente['apoderado_dni'],
                    "nombres"   => $paciente['apoderado_nombres'],
                    "vinculo"   => $paciente['apoderado_vinculo'],
                    "telefono"  => $paciente['apoderado_telefono'],
                    "ocupacion" => $paciente['apoderado_ocupacion'],
                    "domicilio" => $paciente['apoderado_domicilio']
                ];
                responderJSON(["error" => false, "encontrado" => true, "paciente" => $paciente]);
            } else {
                responderJSON(["error" => false, "encontrado" => false, "mensaje" => "Paciente no encontrado"], 404);
            }
        } else {
            $stmt = $db->query("SELECT * FROM pacientes ORDER BY id DESC");
            $pacientes = $stmt->fetchAll();

            // Mapear cada paciente para que tenga la estructura que espera el frontend
            foreach ($pacientes as &$p) {
                $p['apoderado'] = [
                    "dni"       => $p['apoderado_dni'],
                    "nombres"   => $p['apoderado_nombres'],
                    "vinculo"   => $p['apoderado_vinculo'],
                    "telefono"  => $p['apoderado_telefono'],
                    "ocupacion" => $p['apoderado_ocupacion'],
                    "domicilio" => $p['apoderado_domicilio']
                ];
            }

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
    $establecimiento = trim($datos['establecimiento'] ?? 'IESTP CARHUAZ - TÓPICO INSTITUCIONAL');
    $fechaRegistro   = trim($datos['fechaRegistro'] ?? $datos['fecha_registro'] ?? date('Y-m-d H:i:s'));
    $apePaterno      = trim($datos['apePaterno'] ?? $datos['ape_paterno'] ?? '');
    $apeMaterno      = trim($datos['apeMaterno'] ?? $datos['ape_materno'] ?? '');
    $nombres         = trim($datos['nombres'] ?? '');
    $fechaNacimiento = trim($datos['fechaNacimiento'] ?? $datos['fecha_nacimiento'] ?? '');
    $edad            = intval($datos['edad'] ?? 0);
    $genero          = trim($datos['genero'] ?? '');
    $nacionalidad    = trim($datos['nacionalidad'] ?? 'Peruana');
    $etnia           = trim($datos['etnia'] ?? 'Mestizo');
    $programa        = trim($datos['programa'] ?? '');
    $telefono        = trim($datos['telefono'] ?? '');
    $departamento    = trim($datos['dep'] ?? $datos['departamento'] ?? '');
    $provincia       = trim($datos['prov'] ?? $datos['provincia'] ?? '');
    $distrito        = trim($datos['dist'] ?? $datos['distrito'] ?? '');
    $domicilio       = trim($datos['domicilio'] ?? '');
    $referencia      = trim($datos['referencia'] ?? '');

    // Apoderado
    $apo = isset($datos['apoderado']) && is_array($datos['apoderado']) ? $datos['apoderado'] : [];
    $apoDni       = trim($apo['dni'] ?? $datos['apoderado_dni'] ?? '');
    $apoNombres   = trim($apo['nombres'] ?? $datos['apoderado_nombres'] ?? '');
    $apoVinculo   = trim($apo['vinculo'] ?? $datos['apoderado_vinculo'] ?? '');
    $apoTelefono  = trim($apo['telefono'] ?? $datos['apoderado_telefono'] ?? '');
    $apoOcupacion = trim($apo['ocupacion'] ?? $datos['apoderado_ocupacion'] ?? '');
    $apoDomicilio = trim($apo['domicilio'] ?? $datos['apoderado_domicilio'] ?? '');

    if (empty($dni) || empty($apePaterno) || empty($nombres)) {
        responderJSON(["error" => true, "mensaje" => "DNI, Apellidos y Nombres son obligatorios."], 400);
    }

    try {
        // Verificar si el DNI ya existe
        $check = $db->prepare("SELECT id FROM pacientes WHERE dni = :dni LIMIT 1");
        $check->execute([':dni' => $dni]);
        if ($check->fetch()) {
            responderJSON(["error" => true, "mensaje" => "El paciente con DNI $dni ya se encuentra registrado."], 409);
        }

        $sql = "INSERT INTO pacientes (
            historia_clinica, establecimiento, fecha_registro, dni,
            ape_paterno, ape_materno, nombres, fecha_nacimiento, edad,
            genero, nacionalidad, etnia, programa, telefono,
            departamento, provincia, distrito, domicilio, referencia,
            apoderado_dni, apoderado_nombres, apoderado_vinculo, apoderado_telefono,
            apoderado_ocupacion, apoderado_domicilio
        ) VALUES (
            :historia, :estab, :freg, :dni,
            :apep, :apem, :nom, :fnac, :edad,
            :gen, :nac, :etn, :prog, :tel,
            :dep, :prov, :dist, :dom, :ref,
            :apodni, :aponom, :apovin, :apotel,
            :apoocu, :apodom
        )";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':historia' => $historiaClinica,
            ':estab'    => $establecimiento,
            ':freg'     => $fechaRegistro,
            ':dni'      => $dni,
            ':apep'     => $apePaterno,
            ':apem'     => $apeMaterno,
            ':nom'      => $nombres,
            ':fnac'     => $fechaNacimiento ?: '2000-01-01',
            ':edad'     => $edad,
            ':gen'      => $genero,
            ':nac'      => $nacionalidad,
            ':etn'      => $etnia,
            ':prog'     => $programa,
            ':tel'      => $telefono,
            ':dep'      => $departamento,
            ':prov'     => $provincia,
            ':dist'     => $distrito,
            ':dom'      => $domicilio,
            ':ref'      => $referencia,
            ':apodni'   => $apoDni,
            ':aponom'   => $apoNombres,
            ':apovin'   => $apoVinculo,
            ':apotel'   => $apoTelefono,
            ':apoocu'   => $apoOcupacion,
            ':apodom'   => $apoDomicilio
        ]);

        responderJSON([
            "error" => false,
            "mensaje" => "Paciente registrado exitosamente.",
            "id" => $db->lastInsertId(),
            "historiaClinica" => $historiaClinica
        ], 201);
    } catch (PDOException $e) {
        responderJSON(["error" => true, "mensaje" => "Error al guardar paciente: " . $e->getMessage()], 500);
    }
}
