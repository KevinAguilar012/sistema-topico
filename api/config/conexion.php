<?php
// ================================================================
// CONEXIÓN A LA BASE DE DATOS MEDIANTE PDO (MySQL / MariaDB)
// ================================================================

class Conexion {

    // Parámetros de conexión por defecto para XAMPP
    private static $host = "localhost";
    private static $port = "3306";
    private static $db   = "sistema_topico";
    private static $user = "root";
    private static $pass = "";

    /**
     * Retorna un objeto PDO conectado a la base de datos
     */
    public static function conectar() {
        try {
            $dsn = "mysql:host=" . self::$host . ";port=" . self::$port . ";dbname=" . self::$db . ";charset=utf8mb4";
            
            $opciones = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];

            $conn = new PDO($dsn, self::$user, self::$pass, $opciones);
            return $conn;
        } catch (PDOException $e) {
            // Devuelve null en caso de que la base de datos o el servicio MySQL no estén disponibles
            return null;
        }
    }

    /**
     * Prueba si la conexión es exitosa y retorna detalles del estado
     */
    public static function estadoConexion() {
        try {
            $dsn = "mysql:host=" . self::$host . ";port=" . self::$port . ";charset=utf8mb4";
            $conn = new PDO($dsn, self::$user, self::$pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);

            // Verificar si la base de datos existe
            $stmt = $conn->query("SHOW DATABASES LIKE '" . self::$db . "'");
            $existeBD = $stmt->fetch();

            if (!$existeBD) {
                return [
                    "conectado" => false,
                    "mensaje" => "El servidor MySQL está activo, pero la base de datos '" . self::$db . "' aún no ha sido creada. Importa 'database/schema.sql'."
                ];
            }

            return [
                "conectado" => true,
                "mensaje" => "Conexión a la base de datos '" . self::$db . "' establecida con éxito."
            ];
        } catch (PDOException $e) {
            return [
                "conectado" => false,
                "mensaje" => "No se pudo conectar al servidor MySQL en " . self::$host . ". ¿Está encendido el módulo MySQL en XAMPP? Error: " . $e->getMessage()
            ];
        }
    }
}
