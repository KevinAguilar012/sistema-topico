<?php
// ================================================================
// ENDPOINT: BOTIQUÍN E INVENTARIO DE MEDICAMENTOS
// GET  /api/botiquin.php            -> Listar inventario de medicamentos
// POST /api/botiquin.php            -> Registrar insumo o incrementar stock
// POST /api/botiquin.php?action=descontar -> Descontar stock
// ================================================================

require_once __DIR__ . "/config/cors.php";
require_once __DIR__ . "/config/conexion.php";

$db = Conexion::conectar();
if (!$db) {
    responderJSON(["error" => true, "mensaje" => "No hay conexión a la base de datos."], 503);
}

$metodo = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// ----------------------------------------------------------------
// 1. LISTAR MEDICAMENTOS (GET)
// ----------------------------------------------------------------
if ($metodo === 'GET') {
    try {
        $stmt = $db->query("SELECT id, codigo, nombre, categoria, stock, vencimiento FROM medicamentos ORDER BY nombre ASC");
        $medicamentos = $stmt->fetchAll();
        responderJSON(["error" => false, "datos" => $medicamentos]);
    } catch (PDOException $e) {
        responderJSON(["error" => true, "mensaje" => "Error al consultar botiquín: " . $e->getMessage()], 500);
    }
}

// ----------------------------------------------------------------
// 2. REGISTRAR O ACTUALIZAR STOCK (POST)
// ----------------------------------------------------------------
if ($metodo === 'POST') {
    $datos = obtenerDatosEntrada();
    $subAction = isset($datos['action']) ? $datos['action'] : $action;

    // A. DESCONTAR STOCK (EJ. TRAS ATENCIÓN O RECETA)
    if ($subAction === 'descontar') {
        $codigo = trim($datos['codigo'] ?? '');
        $cantidad = intval($datos['cantidad'] ?? 1);

        if (empty($codigo)) {
            responderJSON(["error" => true, "mensaje" => "Código de insumo requerido."], 400);
        }

        try {
            $stmt = $db->prepare("UPDATE medicamentos SET stock = GREATEST(stock - :cant, 0) WHERE codigo = :cod");
            $stmt->execute([':cant' => $cantidad, ':cod' => $codigo]);
            responderJSON(["error" => false, "mensaje" => "Stock descontado exitosamente."]);
        } catch (PDOException $e) {
            responderJSON(["error" => true, "mensaje" => "Error al descontar stock: " . $e->getMessage()], 500);
        }
    }

    // B. INGRESAR NUEVO INSUMO O SUMAR STOCK
    $codigo      = strtoupper(trim($datos['codigo'] ?? ''));
    $nombre      = trim($datos['nombre'] ?? '');
    $categoria   = trim($datos['categoria'] ?? 'Primeros Auxilios');
    $cantidad    = intval($datos['cantidad'] ?? $datos['stock'] ?? 0);
    $vencimiento = trim($datos['vencimiento'] ?? '');

    if (empty($codigo) || empty($nombre) || $cantidad <= 0 || empty($vencimiento)) {
        responderJSON(["error" => true, "mensaje" => "Código, nombre, cantidad (>0) y fecha de vencimiento son requeridos."], 400);
    }

    try {
        // Verificar si el insumo ya existe para sumar stock o crear nuevo
        $check = $db->prepare("SELECT id, stock, nombre FROM medicamentos WHERE codigo = :cod LIMIT 1");
        $check->execute([':cod' => $codigo]);
        $existente = $check->fetch();

        if ($existente) {
            $nuevoStock = $existente['stock'] + $cantidad;
            $update = $db->prepare("UPDATE medicamentos SET stock = :stock, vencimiento = :venc, nombre = :nom, categoria = :cat WHERE codigo = :cod");
            $update->execute([
                ':stock' => $nuevoStock,
                ':venc'  => $vencimiento,
                ':nom'   => $nombre,
                ':cat'   => $categoria,
                ':cod'   => $codigo
            ]);

            responderJSON([
                "error" => false,
                "mensaje" => "Stock incrementado para {$existente['nombre']}. Nuevo stock: $nuevoStock unidades.",
                "nuevoStock" => $nuevoStock
            ]);
        } else {
            $insert = $db->prepare("INSERT INTO medicamentos (codigo, nombre, categoria, stock, vencimiento) VALUES (:cod, :nom, :cat, :stock, :venc)");
            $insert->execute([
                ':cod'   => $codigo,
                ':nom'   => $nombre,
                ':cat'   => $categoria,
                ':stock' => $cantidad,
                ':venc'  => $vencimiento
            ]);

            responderJSON([
                "error" => false,
                "mensaje" => "Nuevo medicamento añadido al botiquín exitosamente.",
                "id" => $db->lastInsertId()
            ], 201);
        }
    } catch (PDOException $e) {
        responderJSON(["error" => true, "mensaje" => "Error al procesar medicamento: " . $e->getMessage()], 500);
    }
}
