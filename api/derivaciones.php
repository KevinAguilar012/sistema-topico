<?php
// ================================================================
// ENDPOINT: DERIVACIONES Y REFERENCIAS EXTERNAS
// GET  /api/derivaciones.php        -> Listar derivaciones
// POST /api/derivaciones.php        -> Registrar nueva derivación
// ================================================================

require_once __DIR__ . "/config/cors.php";
require_once __DIR__ . "/config/conexion.php";

$db = Conexion::conectar();
if (!$db) {
    responderJSON(["error" => true, "mensaje" => "No hay conexión a la base de datos."], 503);
}

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM derivaciones ORDER BY id DESC");
        $derivaciones = $stmt->fetchAll();
        responderJSON(["error" => false, "datos" => $derivaciones]);
    } catch (PDOException $e) {
        responderJSON(["error" => true, "mensaje" => "Error al consultar derivaciones: " . $e->getMessage()], 500);
    }
}

if ($metodo === 'POST') {
    $datos = obtenerDatosEntrada();

    $dni             = trim($datos['dni'] ?? '');
    $paciente        = trim($datos['paciente'] ?? '');
    $establecimiento = trim($datos['establecimiento'] ?? '');
    $motivo          = trim($datos['motivo'] ?? '');
    $acompanante     = trim($datos['acompanante'] ?? '');
    $personal        = trim($datos['personal'] ?? 'Lic. Enfermería');

    if (empty($dni) || empty($establecimiento) || empty($motivo)) {
        responderJSON(["error" => true, "mensaje" => "DNI, establecimiento de destino y motivo son obligatorios."], 400);
    }

    try {
        $sql = "INSERT INTO derivaciones (
            fecha_derivacion, dni_paciente, paciente_nombre, establecimiento_destino,
            motivo, acompanante, personal_responsable
        ) VALUES (
            NOW(), :dni, :paciente, :estab,
            :motivo, :acomp, :personal
        )";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':dni'      => $dni,
            ':paciente' => $paciente,
            ':estab'    => $establecimiento,
            ':motivo'   => $motivo,
            ':acomp'    => $acompanante,
            ':personal' => $personal
        ]);

        responderJSON([
            "error" => false,
            "mensaje" => "Ficha de derivación registrada con éxito.",
            "id" => $db->lastInsertId()
        ], 201);
    } catch (PDOException $e) {
        responderJSON(["error" => true, "mensaje" => "Error al registrar derivación: " . $e->getMessage()], 500);
    }
}
