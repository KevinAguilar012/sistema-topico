<?php
// ================================================================
// ENDPOINT: USUARIOS Y PERSONAL DE SALUD
// GET  /api/usuarios.php            -> Listar personal registrado
// POST /api/usuarios.php?action=login    -> Iniciar sesión
// POST /api/usuarios.php?action=register -> Registrar nuevo personal
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
// 1. LISTAR USUARIOS (GET)
// ----------------------------------------------------------------
if ($metodo === 'GET') {
    try {
        $stmt = $db->query("SELECT id, nombre, cep, usuario, turno, created_at FROM usuarios WHERE estado = 1 ORDER BY id ASC");
        $usuarios = $stmt->fetchAll();
        responderJSON(["error" => false, "datos" => $usuarios]);
    } catch (PDOException $e) {
        responderJSON(["error" => true, "mensaje" => "Error al consultar usuarios: " . $e->getMessage()], 500);
    }
}

// ----------------------------------------------------------------
// 2. REGISTRAR O AUTENTICAR USUARIO (POST)
// ----------------------------------------------------------------
if ($metodo === 'POST') {
    $datos = obtenerDatosEntrada();
    $subAction = isset($datos['action']) ? $datos['action'] : $action;

    // A. LOGIN
    if ($subAction === 'login') {
        $usuario = trim($datos['usuario'] ?? '');
        $pass    = trim($datos['pass'] ?? '');

        if (empty($usuario) || empty($pass)) {
            responderJSON(["error" => true, "mensaje" => "Ingrese usuario y contraseña."], 400);
        }

        try {
            $stmt = $db->prepare("SELECT id, nombre, cep, usuario, pass, turno FROM usuarios WHERE usuario = :usuario AND estado = 1 LIMIT 1");
            $stmt->execute([':usuario' => $usuario]);
            $user = $stmt->fetch();

            if ($user && ($user['pass'] === $pass || password_verify($pass, $user['pass']))) {
                unset($user['pass']); // No enviar la contraseña al cliente
                responderJSON([
                    "error" => false,
                    "mensaje" => "Autenticación satisfactoria",
                    "usuario" => $user
                ]);
            } else {
                responderJSON(["error" => true, "mensaje" => "Usuario o contraseña incorrectos."], 401);
            }
        } catch (PDOException $e) {
            responderJSON(["error" => true, "mensaje" => "Error de base de datos: " . $e->getMessage()], 500);
        }
    }

    // B. REGISTRO DE NUEVO PERSONAL
    $nombre  = trim($datos['nombre'] ?? '');
    $cep     = trim($datos['cep'] ?? '');
    $usuario = trim($datos['usuario'] ?? '');
    $pass    = trim($datos['pass'] ?? '');
    $turno   = trim($datos['turno'] ?? 'Mañana');

    if (empty($nombre) || empty($cep) || empty($usuario) || empty($pass)) {
        responderJSON(["error" => true, "mensaje" => "Todos los campos son obligatorios."], 400);
    }

    try {
        // Verificar si el nombre de usuario ya existe
        $check = $db->prepare("SELECT id FROM usuarios WHERE usuario = :usuario LIMIT 1");
        $check->execute([':usuario' => $usuario]);
        if ($check->fetch()) {
            responderJSON(["error" => true, "mensaje" => "El nombre de usuario ya está registrado."], 409);
        }

        $sql = "INSERT INTO usuarios (nombre, cep, usuario, pass, turno) VALUES (:nombre, :cep, :usuario, :pass, :turno)";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':nombre'  => $nombre,
            ':cep'     => $cep,
            ':usuario' => $usuario,
            ':pass'    => $pass,
            ':turno'   => $turno
        ]);

        responderJSON([
            "error" => false,
            "mensaje" => "Personal de salud registrado exitosamente.",
            "id" => $db->lastInsertId()
        ], 201);
    } catch (PDOException $e) {
        responderJSON(["error" => true, "mensaje" => "Error al registrar usuario: " . $e->getMessage()], 500);
    }
}
