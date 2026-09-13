<?php
// ================================================================
// ENDPOINT: VERIFICAR ESTADO DE LA BASE DE DATOS
// GET /api/test_conexion.php
// ================================================================

require_once __DIR__ . "/config/cors.php";
require_once __DIR__ . "/config/conexion.php";

$estado = Conexion::estadoConexion();

if ($estado['conectado']) {
    responderJSON([
        "status" => "ok",
        "conectado" => true,
        "mensaje" => $estado['mensaje'],
        "timestamp" => date("Y-m-d H:i:s")
    ], 200);
} else {
    responderJSON([
        "status" => "error",
        "conectado" => false,
        "mensaje" => $estado['mensaje'],
        "timestamp" => date("Y-m-d H:i:s")
    ], 503);
}
