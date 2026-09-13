<?php
// ================================================================
// ENDPOINT: ATENCIONES CLÍNICAS Y TRIAJE
// GET  /api/atenciones.php          -> Listar historial de atenciones
// POST /api/atenciones.php          -> Registrar nueva atención médica
// ================================================================

require_once __DIR__ . "/config/cors.php";
require_once __DIR__ . "/config/conexion.php";

$db = Conexion::conectar();
if (!$db) {
    responderJSON(["error" => true, "mensaje" => "No hay conexión a la base de datos."], 503);
}

$metodo = $_SERVER['REQUEST_METHOD'];

// ----------------------------------------------------------------
// 1. LISTAR ATENCIONES (GET)
// ----------------------------------------------------------------
if ($metodo === 'GET') {
    $filtroDni = isset($_GET['dni']) ? trim($_GET['dni']) : '';
    $filtroDiag = isset($_GET['diagnostico']) ? trim($_GET['diagnostico']) : '';

    try {
        $sql = "SELECT 
                    id,
                    DATE_FORMAT(fecha_atencion, '%d/%m/%Y %H:%i') AS fecha,
                    fecha_atencion,
                    dni_paciente AS dni,
                    paciente_nombre AS paciente,
                    programa,
                    temperatura AS temp,
                    diagnostico,
                    subtipo,
                    tratamiento,
                    destino,
                    licenciada,
                    observaciones,
                    created_at
                FROM atenciones WHERE 1=1";
        $params = [];

        if (!empty($filtroDni)) {
            $sql .= " AND (dni_paciente LIKE :dni OR paciente_nombre LIKE :nom)";
            $params[':dni'] = "%$filtroDni%";
            $params[':nom'] = "%$filtroDni%";
        }

        if (!empty($filtroDiag) && $filtroDiag !== 'TODOS') {
            $sql .= " AND diagnostico = :diag";
            $params[':diag'] = $filtroDiag;
        }

        $sql .= " ORDER BY fecha_atencion DESC, id DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $atenciones = $stmt->fetchAll();

        responderJSON(["error" => false, "datos" => $atenciones]);
    } catch (PDOException $e) {
        responderJSON(["error" => true, "mensaje" => "Error al listar atenciones: " . $e->getMessage()], 500);
    }
}

// ----------------------------------------------------------------
// 2. REGISTRAR ATENCIÓN (POST)
// ----------------------------------------------------------------
if ($metodo === 'POST') {
    $datos = obtenerDatosEntrada();

    $dni         = trim($datos['dni'] ?? $datos['dni_paciente'] ?? '');
    $paciente    = trim($datos['paciente'] ?? $datos['paciente_nombre'] ?? '');
    $programa    = trim($datos['programa'] ?? '');
    $diagnostico = trim($datos['diagnostico'] ?? '');
    $subtipo     = trim($datos['subtipo'] ?? '');
    $temp        = trim($datos['temp'] ?? $datos['temperatura'] ?? 'N/A');
    $tratamiento = trim($datos['tratamiento'] ?? '');
    $destino     = trim($datos['destino'] ?? 'Tópico / Reposo');
    $licenciada  = trim($datos['licenciada'] ?? 'Lic. de Guardia');
    $obs         = trim($datos['observaciones'] ?? '');

    if (empty($dni) || empty($diagnostico)) {
        responderJSON(["error" => true, "mensaje" => "DNI y Diagnóstico son obligatorios."], 400);
    }

    try {
        $db->beginTransaction();

        $sql = "INSERT INTO atenciones (
            fecha_atencion, dni_paciente, paciente_nombre, programa,
            temperatura, diagnostico, subtipo, tratamiento, destino,
            licenciada, observaciones
        ) VALUES (
            NOW(), :dni, :paciente, :programa,
            :temp, :diag, :subtipo, :trat, :destino,
            :lic, :obs
        )";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':dni'      => $dni,
            ':paciente' => $paciente,
            ':programa' => $programa,
            ':temp'     => $temp,
            ':diag'     => $diagnostico,
            ':subtipo'  => $subtipo,
            ':trat'     => $tratamiento,
            ':destino'  => $destino,
            ':lic'      => $licenciada,
            ':obs'      => $obs
        ]);

        $idAtencion = $db->lastInsertId();

        // Descontar medicamento según diagnóstico en botiquín
        if ($diagnostico === 'IRA') {
            $updateMed = $db->prepare("UPDATE medicamentos SET stock = GREATEST(stock - 1, 0) WHERE codigo = 'MED-001'");
            $updateMed->execute();
        } else if ($diagnostico === 'EDA') {
            $updateMed = $db->prepare("UPDATE medicamentos SET stock = GREATEST(stock - 1, 0) WHERE codigo = 'MED-002'");
            $updateMed->execute();
        }

        $db->commit();

        responderJSON([
            "error" => false,
            "mensaje" => "Atención clínica registrada exitosamente.",
            "id" => $idAtencion,
            "fecha" => date("d/m/Y H:i")
        ], 201);
    } catch (PDOException $e) {
        $db->rollBack();
        responderJSON(["error" => true, "mensaje" => "Error al registrar atención: " . $e->getMessage()], 500);
    }
}
