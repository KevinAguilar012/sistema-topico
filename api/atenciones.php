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

// Auto-crear y popular tabla 'atenciones' si aún no existe o está vacía
inicializarTablaAtenciones($db);

function inicializarTablaAtenciones($db) {
    try {
        $db->exec("CREATE TABLE IF NOT EXISTS `atenciones` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `fecha_atencion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `dni_paciente` VARCHAR(20) NOT NULL,
            `paciente_nombre` VARCHAR(255) NOT NULL,
            `programa` VARCHAR(150) DEFAULT 'Enfermería Técnica',
            `temperatura` VARCHAR(20) DEFAULT '36.5°C',
            `diagnostico` VARCHAR(100) NOT NULL,
            `subtipo` VARCHAR(255) DEFAULT '',
            `tratamiento` TEXT DEFAULT NULL,
            `destino` VARCHAR(150) DEFAULT 'Tópico / Reposo',
            `licenciada` VARCHAR(150) DEFAULT 'Lic. Enfermería',
            `observaciones` TEXT DEFAULT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (`dni_paciente`),
            INDEX (`diagnostico`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $cnt = $db->query("SELECT COUNT(*) FROM atenciones")->fetchColumn();
        if (intval($cnt) === 0) {
            $checkRelational = $db->query("SHOW TABLES LIKE 'atencion'")->fetch();
            if ($checkRelational) {
                $db->exec("INSERT INTO atenciones (
                    id, fecha_atencion, dni_paciente, paciente_nombre, programa,
                    temperatura, diagnostico, subtipo, tratamiento, destino, licenciada, observaciones
                )
                SELECT 
                    a.idatencion AS id,
                    CONCAT(a.fecha_atencion, ' ', a.hora_atencion) AS fecha_atencion,
                    p.dni AS dni_paciente,
                    TRIM(CONCAT(p.nombres, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, ''))) AS paciente_nombre,
                    IF(est.idestudiante IS NOT NULL, COALESCE(c.nombre_carrera, 'Enfermería Técnica'), IF(doc.iddocente IS NOT NULL, 'Otros (Docentes, Administrativos)', IF(adm.idadministrativo IS NOT NULL, 'Otros (Docentes, Administrativos)', 'Enfermería Técnica'))) AS programa,
                    COALESCE(ec.temperatura, '36.5°C') AS temperatura,
                    CASE 
                        WHEN ta.nombre LIKE '%Respiratoria%' OR ta.nombre LIKE '%IRA%' THEN 'IRA'
                        WHEN ta.nombre LIKE '%Diarreica%' OR ta.nombre LIKE '%EDA%' THEN 'EDA'
                        ELSE 'Otros'
                    END AS diagnostico,
                    COALESCE(ira.clasificacion, eda.clasificacion, a.motivo_consulta, '-') AS subtipo,
                    'Tópico / Reposo' AS tratamiento,
                    'Tópico / Reposo' AS destino,
                    COALESCE(a.licenciada, 'Lic. Enfermería') AS licenciada,
                    a.observaciones
                FROM atencion a
                JOIN persona p ON a.persona_idpersona = p.idpersona
                LEFT JOIN tipo_atencion ta ON a.tipo_atencion_idtipo_atencion = ta.idtipo_atencion
                LEFT JOIN evaluacion_clinica ec ON ec.atencion_idatencion = a.idatencion
                LEFT JOIN atencion_ira ira ON ira.atencion_idatencion = a.idatencion
                LEFT JOIN atencion_eda eda ON eda.atencion_idatencion = a.idatencion
                LEFT JOIN estudiante est ON est.persona_idpersona = p.idpersona
                LEFT JOIN carrera c ON est.carrera_idcarrera = c.idcarrera
                LEFT JOIN docente doc ON doc.persona_idpersona = p.idpersona
                LEFT JOIN administrativo adm ON adm.persona_idpersona = p.idpersona
                ORDER BY a.idatencion ASC");
            }
        }

        // Corregir registros existentes que tienen 'Estudiante' en vez del nombre real del programa
        try {
            $checkCarrera = $db->query("SHOW TABLES LIKE 'carrera'")->fetch();
            if ($checkCarrera) {
                // 1. Asignar carrera correspondiente a los estudiantes registrados
                $db->exec("UPDATE atenciones at
                    JOIN persona p ON at.dni_paciente = p.dni
                    JOIN estudiante est ON est.persona_idpersona = p.idpersona
                    JOIN carrera c ON est.carrera_idcarrera = c.idcarrera
                    SET at.programa = c.nombre_carrera
                    WHERE (at.programa = 'Estudiante' OR at.programa = 'Docentes / Adm.' OR at.programa IS NULL OR at.programa = '')
                    AND c.nombre_carrera IS NOT NULL");

                // 2. Asignar 'Otros (Docentes, Administrativos)' a docentes y administrativos
                $db->exec("UPDATE atenciones at
                    JOIN persona p ON at.dni_paciente = p.dni
                    LEFT JOIN docente doc ON doc.persona_idpersona = p.idpersona
                    LEFT JOIN administrativo adm ON adm.persona_idpersona = p.idpersona
                    SET at.programa = 'Otros (Docentes, Administrativos)'
                    WHERE (at.programa = 'Estudiante' OR at.programa = 'Docentes / Adm.' OR at.programa IS NULL OR at.programa = '')
                    AND (doc.iddocente IS NOT NULL OR adm.idadministrativo IS NOT NULL)");

                // 3. Casos remanentes que aún digan 'Estudiante' o estén vacíos -> Enfermería Técnica
                $db->exec("UPDATE atenciones
                    SET programa = 'Enfermería Técnica'
                    WHERE programa = 'Estudiante' OR programa IS NULL OR programa = ''");

                // 4. Casos remanentes que digan 'Docentes / Adm.' -> Otros (Docentes, Administrativos)
                $db->exec("UPDATE atenciones
                    SET programa = 'Otros (Docentes, Administrativos)'
                    WHERE programa = 'Docentes / Adm.'");
            }
        } catch (Exception $e2) {
            // Ignorar si no se pudo actualizar
        }
    } catch (Exception $e) {
        // Ignorar si no se pudo autoinicializar
    }
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
                    at.id,
                    DATE_FORMAT(at.fecha_atencion, '%d/%m/%Y %H:%i') AS fecha,
                    at.fecha_atencion,
                    at.dni_paciente AS dni,
                    at.paciente_nombre AS paciente,
                    CASE 
                        WHEN at.programa IS NOT NULL AND at.programa != '' AND at.programa != 'Estudiante' AND at.programa != 'Docentes / Adm.' 
                            THEN at.programa
                        WHEN c.nombre_carrera IS NOT NULL 
                            THEN c.nombre_carrera
                        WHEN doc.iddocente IS NOT NULL OR adm.idadministrativo IS NOT NULL 
                            THEN 'Otros (Docentes, Administrativos)'
                        ELSE 'Enfermería Técnica'
                    END AS programa,
                    at.temperatura AS temp,
                    at.diagnostico,
                    at.subtipo,
                    at.tratamiento,
                    at.destino,
                    at.licenciada,
                    at.observaciones,
                    at.created_at
                FROM atenciones at
                LEFT JOIN persona p ON at.dni_paciente = p.dni
                LEFT JOIN estudiante est ON est.persona_idpersona = p.idpersona
                LEFT JOIN carrera c ON est.carrera_idcarrera = c.idcarrera
                LEFT JOIN docente doc ON doc.persona_idpersona = p.idpersona
                LEFT JOIN administrativo adm ON adm.persona_idpersona = p.idpersona
                WHERE 1=1";
        $params = [];

        if (!empty($filtroDni)) {
            $sql .= " AND (at.dni_paciente LIKE :dni OR at.paciente_nombre LIKE :nom)";
            $params[':dni'] = "%$filtroDni%";
            $params[':nom'] = "%$filtroDni%";
        }

        if (!empty($filtroDiag) && $filtroDiag !== 'TODOS') {
            $sql .= " AND (at.diagnostico = :diag OR at.diagnostico LIKE :diagLike)";
            $params[':diag'] = $filtroDiag;
            $params[':diagLike'] = "$filtroDiag%";
        }

        $sql .= " ORDER BY at.fecha_atencion DESC, at.id DESC";

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
    $fechaHoraRaw = trim($datos['fechaHora'] ?? $datos['fecha_hora'] ?? '');
    $fechaAtn    = !empty($fechaHoraRaw) ? str_replace('T', ' ', $fechaHoraRaw) . ':00' : date('Y-m-d H:i:s');

    if (empty($dni) || empty($diagnostico)) {
        responderJSON(["error" => true, "mensaje" => "DNI y Diagnóstico son obligatorios."], 400);
    }

    // Si el programa viene como 'Estudiante', 'Docentes / Adm.' o vacío, resolver el nombre real
    if (empty($programa) || $programa === 'Estudiante' || $programa === 'Docentes / Adm.') {
        try {
            $stmtProg = $db->prepare("SELECT c.nombre_carrera, doc.iddocente, adm.idadministrativo
                FROM persona p
                LEFT JOIN estudiante est ON est.persona_idpersona = p.idpersona
                LEFT JOIN carrera c ON est.carrera_idcarrera = c.idcarrera
                LEFT JOIN docente doc ON doc.persona_idpersona = p.idpersona
                LEFT JOIN administrativo adm ON adm.persona_idpersona = p.idpersona
                WHERE p.dni = :dni LIMIT 1");
            $stmtProg->execute([':dni' => $dni]);
            $rowProg = $stmtProg->fetch();
            if ($rowProg && !empty($rowProg['nombre_carrera'])) {
                $programa = $rowProg['nombre_carrera'];
            } else if ($rowProg && (!empty($rowProg['iddocente']) || !empty($rowProg['idadministrativo']))) {
                $programa = 'Otros (Docentes, Administrativos)';
            } else {
                $programa = ($programa === 'Docentes / Adm.') ? 'Otros (Docentes, Administrativos)' : 'Enfermería Técnica';
            }
        } catch (Exception $eP) {
            $programa = 'Enfermería Técnica';
        }
    }

    try {
        $db->beginTransaction();

        $sql = "INSERT INTO atenciones (
            fecha_atencion, dni_paciente, paciente_nombre, programa,
            temperatura, diagnostico, subtipo, tratamiento, destino,
            licenciada, observaciones
        ) VALUES (
            :fecha_atencion, :dni, :paciente, :programa,
            :temp, :diag, :subtipo, :trat, :destino,
            :lic, :obs
        )";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':fecha_atencion' => $fechaAtn,
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

        // Descontar medicamento según diagnóstico en botiquín si existe la tabla medicamentos
        try {
            if ($diagnostico === 'IRA') {
                $updateMed = $db->prepare("UPDATE medicamentos SET stock = GREATEST(stock - 1, 0) WHERE codigo = 'MED-001'");
                $updateMed->execute();
            } else if ($diagnostico === 'EDA') {
                $updateMed = $db->prepare("UPDATE medicamentos SET stock = GREATEST(stock - 1, 0) WHERE codigo = 'MED-002'");
                $updateMed->execute();
            }
        } catch (Exception $eMed) {
            // Continuar si no existe medicamentos
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
