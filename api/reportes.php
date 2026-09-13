<?php
// ================================================================
// ENDPOINT: REPORTES Y VIGILANCIA MINSA (FORMULARIO 6)
// GET /api/reportes.php
// ================================================================

require_once __DIR__ . "/config/cors.php";
require_once __DIR__ . "/config/conexion.php";

$db = Conexion::conectar();
if (!$db) {
    responderJSON(["error" => true, "mensaje" => "No hay conexión a la base de datos."], 503);
}

try {
    // 1. Totales generales
    $totalesStmt = $db->query("
        SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN diagnostico = 'IRA' THEN 1 ELSE 0 END) AS iras,
            SUM(CASE WHEN diagnostico = 'EDA' THEN 1 ELSE 0 END) AS edas
        FROM atenciones
    ");
    $totales = $totalesStmt->fetch();

    // 2. Conteo agrupado por programa institucional
    $progStmt = $db->query("
        SELECT 
            programa,
            SUM(CASE WHEN diagnostico = 'IRA' THEN 1 ELSE 0 END) AS iras,
            SUM(CASE WHEN diagnostico = 'EDA' THEN 1 ELSE 0 END) AS edas,
            COUNT(*) AS total
        FROM atenciones
        GROUP BY programa
        ORDER BY total DESC
    ");
    $programas = $progStmt->fetchAll();

    responderJSON([
        "error" => false,
        "estadisticas" => [
            "totalIras"       => intval($totales['iras'] ?? 0),
            "totalEdas"       => intval($totales['edas'] ?? 0),
            "totalAtenciones" => intval($totales['total'] ?? 0),
            "porPrograma"     => $programas
        ]
    ]);
} catch (PDOException $e) {
    responderJSON(["error" => true, "mensaje" => "Error al generar reportes: " . $e->getMessage()], 500);
}
