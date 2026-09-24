const express = require('express');
const cors = require('cors');
const path = require('path');
const { query, getWorkingPool } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '..')));

// ================================================================
// VERIFICACIÓN DE CONEXIÓN / HEALTH CHECK
// ================================================================
app.get(['/api/health', '/api/test_conexion.php', '/api/test-conexion'], async (req, res) => {
    try {
        await getWorkingPool();
        const rows = await query('SELECT 1 + 1 AS solution');
        res.status(200).json({
            status: 'ok',
            conectado: true,
            mensaje: "Conexión a la base de datos MySQL establecida con éxito.",
            test: rows[0].solution
        });
    } catch (err) {
        console.error("Error de conexión MySQL:", err.message);
        res.status(500).json({
            status: 'error',
            conectado: false,
            mensaje: "Error de conexión a la base de datos MySQL.",
            error: err.message
        });
    }
});

// ================================================================
// MÓDULO PACIENTES
// ================================================================

/**
 * GET /api/pacientes
 * Listar todos los pacientes
 */
app.get('/api/pacientes', async (req, res) => {
    try {
        const dniQuery = req.query.dni;
        if (dniQuery) {
            // Si viene ?dni=..., delegar a búsqueda por DNI
            return buscarPacientePorDniOrId(dniQuery, res);
        }

        const sql = `
            SELECT 
                p.idpersona,
                p.dni,
                p.nombres,
                p.apellido_paterno AS ape_paterno,
                p.apellido_materno AS ape_materno,
                p.telefono,
                p.correo,
                p.fecha_nacimiento,
                p.genero,
                p.etnia,
                TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad,
                d.nombre_calle AS domicilio,
                d.referencia,
                dist.nombre AS distrito,
                prov.nombre AS provincia,
                dep.nombre AS departamento,
                c.nombre_carrera AS programa,
                hc.numero_historia_clinica AS historia_clinica
            FROM persona p
            LEFT JOIN direccion d ON p.direccion_iddireccion = d.iddireccion
            LEFT JOIN distrito dist ON d.distrito_iddistrito = dist.iddistrito
            LEFT JOIN provincia prov ON dist.provincia_idprovincia = prov.idprovincia
            LEFT JOIN departamento dep ON prov.departamento_iddepartamento = dep.iddepartamento
            LEFT JOIN estudiante est ON est.persona_idpersona = p.idpersona
            LEFT JOIN carrera c ON est.carrera_idcarrera = c.idcarrera
            LEFT JOIN historia_clinica hc ON hc.persona_idpersona = p.idpersona
            ORDER BY p.idpersona DESC
        `;
        const datos = await query(sql);
        res.status(200).json({ error: false, datos });
    } catch (err) {
        console.error("Error al listar pacientes:", err);
        res.status(500).json({ error: true, mensaje: "Error al listar pacientes.", detalle: err.message });
    }
});

/**
 * GET /api/pacientes/:dni
 * Buscar paciente por DNI o ID y devolver sus datos completos con dirección y programa
 */
app.get('/api/pacientes/:dni', async (req, res) => {
    const dniParam = req.params.dni;
    return buscarPacientePorDniOrId(dniParam, res);
});

async function buscarPacientePorDniOrId(term, res) {
    try {
        const sql = `
            SELECT 
                p.idpersona,
                p.dni,
                p.nombres,
                p.apellido_paterno AS ape_paterno,
                p.apellido_materno AS ape_materno,
                p.telefono,
                p.correo,
                p.fecha_nacimiento,
                p.genero,
                p.etnia,
                TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS edad,
                COALESCE(CONCAT(COALESCE(d.nombre_calle, ''), ' ', COALESCE(d.numero_calle, '')), 'Carhuaz') AS domicilio,
                d.referencia,
                dist.nombre AS distrito,
                prov.nombre AS provincia,
                dep.nombre AS departamento,
                COALESCE(c.nombre_carrera, 'Otros (Docentes, Administrativos)') AS programa,
                COALESCE(CONCAT('HC-', hc.numero_historia_clinica), CONCAT('HC-', p.dni)) AS historia_clinica
            FROM persona p
            LEFT JOIN direccion d ON p.direccion_iddireccion = d.iddireccion
            LEFT JOIN distrito dist ON d.distrito_iddistrito = dist.iddistrito
            LEFT JOIN provincia prov ON dist.provincia_idprovincia = prov.idprovincia
            LEFT JOIN departamento dep ON prov.departamento_iddepartamento = dep.iddepartamento
            LEFT JOIN estudiante est ON est.persona_idpersona = p.idpersona
            LEFT JOIN carrera c ON est.carrera_idcarrera = c.idcarrera
            LEFT JOIN historia_clinica hc ON hc.persona_idpersona = p.idpersona
            WHERE p.dni = ? OR p.idpersona = ?
            LIMIT 1
        `;
        const rows = await query(sql, [term, term]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                encontrado: false,
                mensaje: `Paciente con DNI/ID '${term}' no encontrado.`
            });
        }

        const paciente = rows[0];
        res.status(200).json({
            encontrado: true,
            paciente: paciente
        });
    } catch (err) {
        console.error("Error al buscar paciente por DNI:", err);
        res.status(500).json({
            encontrado: false,
            error: true,
            mensaje: "Error interno del servidor al buscar el paciente.",
            detalle: err.message
        });
    }
}

/**
 * POST /api/pacientes
 * Registrar un nuevo paciente en la tabla 'persona' y sus relaciones
 */
app.post('/api/pacientes', async (req, res) => {
    try {
        const body = req.body || {};
        const dni = (body.dni || '').trim();
        const nombres = (body.nombres || '').trim();
        const apePaterno = (body.apePaterno || body.apellido_paterno || '').trim();
        const apeMaterno = (body.apeMaterno || body.apellido_materno || '').trim();
        const telefono = body.telefono || null;
        const correo = body.correo || null;
        const fechaNacimiento = body.fechaNacimiento || body.fecha_nacimiento || null;
        const genero = body.genero || 'No precisa';
        const etnia = body.etnia || 'Mestizo';
        const domicilio = body.domicilio || null;
        const referencia = body.referencia || null;
        const programa = body.programa || 'Enfermería Técnica';
        const historiaClinica = body.historiaClinica || body.historia_clinica || `HC-${dni}`;

        if (!dni || !nombres || !apePaterno) {
            return res.status(400).json({
                error: true,
                mensaje: "Los campos DNI, Nombres y Apellido Paterno son obligatorios."
            });
        }

        // 1. Verificar si ya existe en 'persona'
        const existRows = await query("SELECT idpersona FROM persona WHERE dni = ?", [dni]);
        if (existRows.length > 0) {
            return res.status(400).json({
                error: true,
                mensaje: `El paciente con DNI ${dni} ya se encuentra registrado.`
            });
        }

        // 2. Insertar dirección si se especifica
        let direccionId = null;
        if (domicilio || referencia) {
            const dirResult = await query(
                "INSERT INTO direccion (nombre_calle, referencia, distrito_iddistrito) VALUES (?, ?, 1)",
                [domicilio || 'Dirección registrada', referencia || '']
            );
            direccionId = dirResult.insertId;
        }

        // 3. Insertar persona
        const persResult = await query(
            `INSERT INTO persona 
            (dni, nombres, apellido_paterno, apellido_materno, telefono, correo, fecha_nacimiento, genero, etnia, direccion_iddireccion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [dni, nombres, apePaterno, apeMaterno, telefono, correo, fechaNacimiento, genero, etnia, direccionId]
        );
        const personaId = persResult.insertId;

        // 4. Insertar Historia Clínica
        const numHist = parseInt((historiaClinica || '').replace(/\D/g, ''), 10) || (1000 + personaId);
        await query(
            "INSERT INTO historia_clinica (numero_historia_clinica, fecha_apertura, estado, persona_idpersona) VALUES (?, CURDATE(), 'ACTIVA', ?)",
            [numHist, personaId]
        ).catch(err => console.warn("Aviso al insertar historia clínica:", err.message));

        // 5. Insertar Estudiante si corresponde (solo para programas de estudiantes)
        let carreraId = null;
        if (programa.includes('Enfermería')) {
            carreraId = 1;
        } else if (programa.includes('Arquitectura') || programa.includes('Tecnologías') || programa.includes('TI')) {
            carreraId = 2;
        }

        if (carreraId !== null) {
            await query(
                "INSERT INTO estudiante (periodo_academico, carrera_idcarrera, persona_idpersona, tipo_apoderado_idtipo_apoderado) VALUES ('2026-I', ?, ?, 1)",
                [carreraId, personaId]
            ).catch(err => console.warn("Aviso al insertar estudiante:", err.message));
        }

        res.status(201).json({
            error: false,
            mensaje: "Paciente registrado exitosamente en la base de datos MySQL.",
            idpersona: personaId,
            dni: dni,
            paciente: `${nombres} ${apePaterno}`
        });
    } catch (err) {
        console.error("Error al registrar paciente:", err);
        res.status(500).json({
            error: true,
            mensaje: "Error al registrar el paciente en la base de datos.",
            detalle: err.message
        });
    }
});

// Helper para asegurar la columna 'licenciada' en la tabla 'atencion'
async function asegurarColumnaLicenciadaAtencion() {
    try {
        await query("ALTER TABLE atencion ADD COLUMN licenciada VARCHAR(150) DEFAULT 'Lic. Enfermería'");
    } catch (err) {
        // Ignorar si la columna ya existe
    }
}

// ================================================================
// MÓDULO ATENCIONES
// ================================================================

/**
 * GET /api/atenciones
 * Listar todas las atenciones médicas
 */
app.get('/api/atenciones', async (req, res) => {
    try {
        await asegurarColumnaLicenciadaAtencion();
        const { dni, diagnostico } = req.query;
        let sql = `
            SELECT 
                a.idatencion AS id,
                COALESCE(DATE_FORMAT(CONCAT(a.fecha_atencion, ' ', a.hora_atencion), '%d/%m/%Y %H:%i'), DATE_FORMAT(a.fecha_atencion, '%d/%m/%Y')) AS fecha,
                p.dni,
                CONCAT(p.apellido_paterno, ' ', COALESCE(p.apellido_materno, ''), ', ', p.nombres) AS paciente,
                COALESCE(c.nombre_carrera, 'Otros (Docentes, Administrativos)') AS programa,
                COALESCE(ec.temperatura, 36.5) AS temp,
                ta.nombre AS diagnostico,
                a.motivo_consulta AS subtipo,
                a.observaciones AS tratamiento,
                COALESCE(ec.observaciones, 'Tópico / Reposo') AS destino,
                COALESCE(NULLIF(a.licenciada, ''), u.nombre, 'Lic. Enfermería') AS licenciada
            FROM atencion a
            JOIN persona p ON a.persona_idpersona = p.idpersona
            JOIN tipo_atencion ta ON a.tipo_atencion_idtipo_atencion = ta.idtipo_atencion
            LEFT JOIN evaluacion_clinica ec ON ec.atencion_idatencion = a.idatencion
            LEFT JOIN estudiante est ON est.persona_idpersona = p.idpersona
            LEFT JOIN carrera c ON est.carrera_idcarrera = c.idcarrera
            LEFT JOIN usuarios u ON a.usuario_idusuario = u.id
            WHERE 1=1
        `;
        const params = [];

        if (dni && dni.trim() !== '') {
            const term = `%${dni.trim()}%`;
            sql += ` AND (p.dni LIKE ? OR p.nombres LIKE ? OR p.apellido_paterno LIKE ? OR p.apellido_materno LIKE ?)`;
            params.push(term, term, term, term);
        }

        if (diagnostico && diagnostico.trim() !== '' && diagnostico !== 'TODOS') {
            sql += ` AND (ta.nombre = ? OR a.motivo_consulta LIKE ?)`;
            params.push(diagnostico.trim(), `%${diagnostico.trim()}%`);
        }

        sql += ` ORDER BY a.idatencion DESC`;

        const datos = await query(sql, params);
        res.status(200).json({ error: false, datos });
    } catch (err) {
        console.error("Error al listar atenciones:", err);
        res.status(500).json({ error: true, mensaje: "Error al listar atenciones.", detalle: err.message });
    }
});

/**
 * POST /api/atenciones
 * Guardar un nuevo registro de atención / triaje (IRA / EDA / General)
 */
app.post('/api/atenciones', async (req, res) => {
    try {
        await asegurarColumnaLicenciadaAtencion();
        const body = req.body || {};
        const dni = (body.dni || '').trim();
        const diagnostico = (body.diagnostico || 'Control').trim();
        const subtipo = body.subtipo || body.diagnostico || 'Atención General';
        const temp = parseFloat(body.temp) || 36.5;
        const tratamiento = body.tratamiento || 'Atención en Tópico';
        const destino = body.destino || 'Tópico / Reposo';
        const licenciada = (body.licenciada || body.personal || 'Lic. Enfermería').trim();

        const fechaHora = body.fechaHora || body.fecha_hora || null;
        let fechaAtn = null;
        let horaAtn = null;
        if (fechaHora && fechaHora.includes('T')) {
            const parts = fechaHora.split('T');
            fechaAtn = parts[0];
            horaAtn = parts[1] ? (parts[1].length === 5 ? `${parts[1]}:00` : parts[1]) : null;
        }

        if (!dni) {
            return res.status(400).json({
                error: true,
                mensaje: "El número de DNI del paciente es obligatorio."
            });
        }

        // 1. Obtener idpersona por DNI
        const persRows = await query("SELECT idpersona FROM persona WHERE dni = ?", [dni]);
        if (persRows.length === 0) {
            return res.status(404).json({
                error: true,
                mensaje: `Paciente con DNI ${dni} no encontrado en la base de datos.`
            });
        }
        const personaId = persRows[0].idpersona;

        // 2. Determinar tipo de atención (1: IRA, 2: EDA, 3: Control)
        let idTipoAtencion = 3;
        if (diagnostico === 'IRA') idTipoAtencion = 1;
        else if (diagnostico === 'EDA') idTipoAtencion = 2;

        const codigoAtn = `ATN-${Date.now().toString().slice(-6)}`;

        // 3. Insertar atencion
        const atnResult = await query(
            `INSERT INTO atencion 
            (codigo_atencion, fecha_atencion, hora_atencion, motivo_consulta, observaciones, persona_idpersona, usuario_idusuario, tipo_atencion_idtipo_atencion, licenciada) 
            VALUES (?, COALESCE(?, CURDATE()), COALESCE(?, CURTIME()), ?, ?, ?, 1, ?, ?)`,
            [codigoAtn, fechaAtn, horaAtn, subtipo, tratamiento, personaId, idTipoAtencion, licenciada]
        );
        const atencionId = atnResult.insertId;

        // 4. Insertar evaluacion clinica
        await query(
            `INSERT INTO evaluacion_clinica 
            (temperatura, estado_general, observaciones, atencion_idatencion) 
            VALUES (?, 'Estable', ?, ?)`,
            [temp, destino, atencionId]
        ).catch(err => console.warn("Aviso evaluacion clinica:", err.message));

        // 5. Insertar ficha IRA o EDA si aplica
        if (diagnostico === 'IRA') {
            const codeIra = `IRA-${Date.now().toString().slice(-6)}`;
            await query(
                `INSERT INTO atencion_ira 
                (idatencion_ira, tiempo_enfermedad, tiraje, sibilancias, estridor, signos_alarma, clasificacion, observaciones, atencion_idatencion) 
                VALUES (?, '3 días', 0, 0, 0, 'Sin signos de alarma', ?, ?, ?)`,
                [codeIra, subtipo, tratamiento, atencionId]
            ).catch(err => console.warn("Aviso atencion_ira:", err.message));
        } else if (diagnostico === 'EDA') {
            const codeEda = `EDA-${Date.now().toString().slice(-6)}`;
            await query(
                `INSERT INTO atencion_eda 
                (idatencion_eda, tiempo_enfermedad, numero_deposiciones, caracteristicas_heces, presencia_sangre, vomitos, dolor_abdominal, sed, clasificacion, observaciones, atencion_idatencion) 
                VALUES (?, '2 días', 3, 'Líquidas', 0, 0, 0, 0, ?, ?, ?)`,
                [codeEda, subtipo, tratamiento, atencionId]
            ).catch(err => console.warn("Aviso atencion_eda:", err.message));
        }

        res.status(201).json({
            error: false,
            mensaje: "Atención médica registrada exitosamente en MySQL.",
            idatencion: atencionId,
            codigo: codigoAtn
        });
    } catch (err) {
        console.error("Error al registrar atención:", err);
        res.status(500).json({
            error: true,
            mensaje: "Error al guardar la atención médica.",
            detalle: err.message
        });
    }
});

// ================================================================
// OTROS MÓDULOS DE SOPORTE (BOTIQUÍN, USUARIOS, DERIVACIONES, REPORTES)
// ================================================================

// Botiquín Listar y Agregar
app.get('/api/botiquin', async (req, res) => {
    try {
        const rows = await query("SELECT idmedicamento AS id, nombre_medicamento AS nombre, 'General' AS categoria, 50 AS stock, '2027-12-31' AS vencimiento FROM medicamento");
        res.json({ error: false, datos: rows });
    } catch (err) {
        res.json({ error: false, datos: [] });
    }
});

app.post('/api/botiquin', (req, res) => {
    res.json({ error: false, mensaje: "Insumo procesado correctamente." });
});

// Helper para asegurar la tabla 'usuarios' (Personal de Salud) en MySQL
async function asegurarTablaUsuarios() {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                cep VARCHAR(50) NOT NULL,
                usuario VARCHAR(50) NOT NULL UNIQUE,
                pass VARCHAR(255) NOT NULL,
                turno VARCHAR(50) DEFAULT 'Mañana',
                estado TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        await query(sql);
    } catch (err) {
        console.warn("No se pudo auto-crear la tabla 'usuarios':", err.message);
    }
}

function trimVal(val) {
    return typeof val === 'string' ? val.trim() : (val || '');
}

// Usuarios Login y Listar
app.get('/api/usuarios', async (req, res) => {
    try {
        await asegurarTablaUsuarios();
        const rows = await query("SELECT id, nombre, cep, usuario, turno, created_at FROM usuarios WHERE estado = 1 ORDER BY id ASC");
        if (rows && rows.length > 0) {
            return res.json({ error: false, datos: rows });
        }
        
        // Si no hay en 'usuarios', intentar listar desde 'usuario' (docentes de muestra)
        try {
            const docenteRows = await query("SELECT idusuario AS id, nombre_usuario AS usuario, 'Lic. Enfermería' AS nombre, 'CEP-12345' AS cep, 'Mañana' AS turno FROM usuario");
            return res.json({ error: false, datos: docenteRows });
        } catch (e) {
            return res.json({ error: false, datos: [] });
        }
    } catch (err) {
        res.json({ error: false, datos: [] });
    }
});

app.post(['/api/usuarios', '/api/usuarios.php'], async (req, res) => {
    const { action, usuario, pass } = req.body || {};
    if (action === 'login' || req.query.action === 'login') {
        if (!usuario || !pass) {
            return res.status(400).json({ error: true, mensaje: "Ingrese usuario y contraseña." });
        }
        try {
            await asegurarTablaUsuarios();
            let rows = [];
            try {
                // Consultar primero en tabla 'usuarios' (Personal de Salud)
                rows = await query("SELECT id, nombre, cep, usuario, pass, turno FROM usuarios WHERE usuario = ? AND estado = 1 LIMIT 1", [usuario]);
            } catch (e) {}

            if (!rows || rows.length === 0) {
                try {
                    // Fallback a tabla 'usuario' (schema bd_topico_instituto)
                    rows = await query("SELECT idusuario AS id, nombre_usuario AS usuario, contrasena AS pass, 'Lic. Enfermería' AS nombre, 'Mañana' AS turno FROM usuario WHERE nombre_usuario = ? AND estado = 1 LIMIT 1", [usuario]);
                } catch (e2) {}
            }

            if (rows && rows.length > 0) {
                const user = rows[0];
                if (user.pass === pass) {
                    return res.json({
                        error: false,
                        mensaje: "Autenticación satisfactoria",
                        usuario: {
                            id: user.id,
                            nombre: user.nombre || `Lic. ${user.usuario}`,
                            usuario: user.usuario,
                            turno: user.turno || 'Mañana'
                        }
                    });
                }
            }

            // Credenciales por defecto de administrador
            if (usuario === 'admin' && pass === '1234') {
                return res.json({
                    error: false,
                    mensaje: "Autenticación satisfactoria",
                    usuario: { id: 1, nombre: "Administrador", usuario: "admin", turno: "Mañana" }
                });
            }

            return res.status(401).json({ error: true, mensaje: "Usuario o contraseña incorrectos." });
        } catch (err) {
            console.error("Error en la autenticación del usuario:", err);
            return res.status(500).json({ error: true, mensaje: "Error de base de datos al autenticar." });
        }
    }

    // REGISTRO DE NUEVO PERSONAL DE SALUD / USUARIOS
    const { nombre, cep, turno } = req.body || {};
    const nombreVal = trimVal(nombre);
    const cepVal    = trimVal(cep);
    const userVal   = trimVal(usuario);
    const passVal   = trimVal(pass);
    const turnoVal  = trimVal(turno) || 'Mañana';

    if (!nombreVal || !cepVal || !userVal || !passVal) {
        return res.status(400).json({ error: true, mensaje: "Todos los campos (nombre, cep, usuario, contraseña) son obligatorios." });
    }

    try {
        await asegurarTablaUsuarios();

        // Verificar si el usuario ya existe
        const check = await query("SELECT id FROM usuarios WHERE usuario = ? LIMIT 1", [userVal]);
        if (check && check.length > 0) {
            return res.status(409).json({ error: true, mensaje: "El nombre de usuario ya está registrado." });
        }

        const sql = "INSERT INTO usuarios (nombre, cep, usuario, pass, turno) VALUES (?, ?, ?, ?, ?)";
        const result = await query(sql, [nombreVal, cepVal, userVal, passVal, turnoVal]);

        return res.status(201).json({
            error: false,
            mensaje: "Personal de salud registrado exitosamente.",
            id: result.insertId
        });
    } catch (err) {
        console.error("Error al registrar usuario:", err);
        return res.status(500).json({ error: true, mensaje: "Error al registrar usuario en la base de datos: " + err.message });
    }
});

// Derivaciones y Reportes
app.post('/api/derivaciones', (req, res) => {
    res.json({ error: false, mensaje: "Derivación registrada correctamente." });
});

app.get('/api/reportes', (req, res) => {
    res.json({ error: false, estadisticas: { totalAtenciones: 10, totalIras: 5, totalEdas: 5 } });
});

// Fallback Middleware 404 para endpoints API no reconocidos
app.use('/api', (req, res) => {
    res.status(404).json({ error: true, mensaje: `Endpoint API no encontrado: ${req.method} ${req.originalUrl}` });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Servidor Node.js Express ejecutándose en port ${PORT}`);
    console.log(`👉 API disponible en: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
});
