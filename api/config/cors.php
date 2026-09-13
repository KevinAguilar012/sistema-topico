<?php
// ================================================================
// CONFIGURACIÓN DE CABECERAS CORS Y FORMATO JSON
// Permite solicitudes desde cualquier origen (Frontend o Servidor Local)
// ================================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Si es una petición de verificación previa (OPTIONS), finalizar con 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Función auxiliar para capturar datos recibidos por POST/PUT
 * Soporta tanto JSON (fetch body) como application/x-www-form-urlencoded ($_POST)
 */
function obtenerDatosEntrada() {
    $cuerpoJson = file_get_contents("php://input");
    $datos = json_decode($cuerpoJson, true);
    if (is_array($datos)) {
        return $datos;
    }
    return !empty($_POST) ? $_POST : [];
}

/**
 * Función para responder en formato JSON estandarizado
 */
function responderJSON($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}
