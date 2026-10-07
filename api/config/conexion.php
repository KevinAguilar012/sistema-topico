<?php
// ================================================================
// CONEXIÓN A LA BASE DE DATOS MEDIANTE PDO (MySQL / MariaDB)
// ================================================================

class Conexion {

    // Parámetros por defecto para GitHub / Producción (las credenciales reales irán en config.local.php)
    private static $prodHost    = "localhost";
    private static $prodHostAlt = "iestpcarhuaz.edu.pe";
    private static $port        = "3306";
    private static $prodDb      = "istecoij_sistema_topico";
    private static $prodUser    = "istecoij_admin";
    private static $prodPass    = ""; // Queda vacío por seguridad en el repositorio

    /**
     * Carga la configuración desde config.local.php si existe
     */
    private static function cargarConfiguracion() {
        $archivoConfig = __DIR__ . '/config.local.php';
        if (file_exists($archivoConfig)) {
            $config = require $archivoConfig;
            if (isset($config['prodHost']))    self::$prodHost    = $config['prodHost'];
            if (isset($config['prodHostAlt'])) self::$prodHostAlt = $config['prodHostAlt'];
            if (isset($config['port']))        self::$port        = $config['port'];
            if (isset($config['prodDb']))      self::$prodDb      = $config['prodDb'];
            if (isset($config['prodUser']))    self::$prodUser    = $config['prodUser'];
            if (isset($config['prodPass']))    self::$prodPass    = $config['prodPass'];
        }
    }

    /**
     * Retorna un objeto PDO conectado a la base de datos (Detección Local vs cPanel)
     */
    public static function conectar() {
        // Carga variables locales/reales si el archivo privado existe
        self::cargarConfiguracion();

        $opciones = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
            PDO::ATTR_TIMEOUT            => 3 // Timeout rápido para evitar bloqueos
        ];

        $httpHost = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? 'localhost';
        $esLocal  = (strpos($httpHost, 'localhost') !== false || strpos($httpHost, '127.0.0.1') !== false || strpos($httpHost, '::1') !== false);

        // --- ENTORNO LOCAL (Offline / XAMPP / WAMP) ---
        if ($esLocal) {
            $credencialesLocales = [
                ['user' => 'root', 'pass' => ''],
                ['user' => 'root', 'pass' => 'root']
            ];
            $basesLocales = [self::$prodDb, 'bd_topico_instituto', 'sistema_topico', 'sistema-topico'];

            foreach ($credencialesLocales as $cred) {
                foreach ($basesLocales as $db) {
                    try {
                        $dsn = "mysql:host=127.0.0.1;port=" . self::$port . ";dbname=" . $db . ";charset=utf8mb4";
                        return new PDO($dsn, $cred['user'], $cred['pass'], $opciones);
                    } catch (PDOException $e) {
                        try {
                            $dsn = "mysql:host=localhost;port=" . self::$port . ";dbname=" . $db . ";charset=utf8mb4";
                            return new PDO($dsn, $cred['user'], $cred['pass'], $opciones);
                        } catch (PDOException $e2) {
                            continue;
                        }
                    }
                }
            }
        }

        // --- ENTORNO PRODUCCIÓN (cPanel Hosting) ---
        $hostsProduccion = [self::$prodHost, self::$prodHostAlt];
        foreach ($hostsProduccion as $h) {
            try {
                $dsn = "mysql:host=" . $h . ";port=" . self::$port . ";dbname=" . self::$prodDb . ";charset=utf8mb4";
                return new PDO($dsn, self::$prodUser, self::$prodPass, $opciones);
            } catch (PDOException $e) {
                continue;
            }
        }

        // Fallback secundario
        $credencialesFallback = [
            ['host' => 'localhost', 'user' => 'root', 'pass' => '', 'db' => self::$prodDb],
            ['host' => '127.0.0.1', 'user' => 'root', 'pass' => '', 'db' => self::$prodDb],
            ['host' => 'localhost', 'user' => 'root', 'pass' => '', 'db' => 'bd_topico_instituto']
        ];
        foreach ($credencialesFallback as $f) {
            try {
                $dsn = "mysql:host=" . $f['host'] . ";port=" . self::$port . ";dbname=" . $f['db'] . ";charset=utf8mb4";
                return new PDO($dsn, $f['user'], $f['pass'], $opciones);
            } catch (PDOException $e) {
                continue;
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
                "mensaje"   => "Conexión a la base de datos establecida con éxito."
            ];
        }

        return [
            "conectado" => false,
            "mensaje"   => "No se pudo conectar a MySQL. En entorno local (XAMPP), asegúrate de que MySQL esté encendido y la BD importada. En cPanel, verifica usuario/contraseña."
        ];
    }
}