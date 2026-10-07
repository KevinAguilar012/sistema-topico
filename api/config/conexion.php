<?php
// ================================================================
// CONEXIÓN A LA BASE DE DATOS MEDIANTE PDO (MySQL / MariaDB)
// ================================================================

class Conexion {

    // Parámetros de conexión a MySQL en cPanel / Producción
    private static $host = "localhost";
    private static $port = "3306";
    private static $db   = "istecoij_sistema_topico";
    private static $user = "istecoij_sistema_topico";
    private static $pass = "NxiZ&Aj?MaL&o*6E";

    /**
     * Retorna un objeto PDO conectado a la base de datos
     */
    public static function conectar() {
        $opciones = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ];

        // 1. Intentar con las credenciales principales (cPanel / Configuración por defecto)
        try {
            $dsn = "mysql:host=" . self::$host . ";port=" . self::$port . ";dbname=" . self::$db . ";charset=utf8mb4";
            return new PDO($dsn, self::$user, self::$pass, $opciones);
        } catch (PDOException $e) {
            // Si el error es falta de servicio MySQL (conexión rechazada 2002), no reintentar
            if (strpos($e->getMessage(), '2002') !== false) {
                return null;
            }
        }

        // 2. Fallback para entorno local (XAMPP / WAMP) con usuario root y sin contraseña
        $credencialesLocales = [
            ['user' => 'root', 'pass' => ''],
            ['user' => 'root', 'pass' => 'root']
        ];
        $basesDeDatosLocales = [self::$db, 'sistema_topico', 'sistema-topico', 'bd_topico_instituto'];

        foreach ($credencialesLocales as $cred) {
            foreach ($basesDeDatosLocales as $dbname) {
                try {
                    $dsn = "mysql:host=" . self::$host . ";port=" . self::$port . ";dbname=" . $dbname . ";charset=utf8mb4";
                    return new PDO($dsn, $cred['user'], $cred['pass'], $opciones);
                } catch (PDOException $e) {
                    continue;
                }
            }
        }

        return null;
    }

    /**
     * Prueba si la conexión es exitosa y retorna detalles del estado
     */
    public static function estadoConexion() {
        $conn = self::conectar();
        if ($conn) {
            return [
                "conectado" => true,
                "mensaje" => "Conexión a la base de datos establecida con éxito."
            ];
        }

        // Diagnóstico detallado del fallo
        try {
            $dsn = "mysql:host=" . self::$host . ";port=" . self::$port . ";charset=utf8mb4";
            $testConn = new PDO($dsn, "root", "", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            
            return [
                "conectado" => false,
                "mensaje" => "El servidor MySQL está activo, pero la base de datos no existe. Importa el archivo 'database/schema.sql'."
            ];
        } catch (PDOException $e) {
            return [
                "conectado" => false,
                "mensaje" => "No se pudo conectar al servidor MySQL en " . self::$host . ". ¿Está encendido el servicio MySQL en XAMPP/servidor? Error: " . $e->getMessage()
            ];
        }
    }
}

