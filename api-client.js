// ================================================================
// SISTEMA INTEGRAL DEL TÓPICO - CLIENTE API (FRONTEND <-> BACKEND)
// Soporta tanto Servidor Node.js + Express como PHP Fallback
// ================================================================

const ApiConfig = {
    // URL base del servidor (Node.js Express o PHP)
    obtenerBaseUrl() {
        const origin = window.location.origin;
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port;

        // Si se abre directamente el archivo HTML (file://)
        if (protocol === 'file:') {
            return 'https://sistema-topico.onrender.com/api';
        }
        // Si estamos en localhost/127.0.0.1 y el puerto no es el 3000 (ej. XAMPP en 80, Live Server en 5500)
        if ((hostname === 'localhost' || hostname === '127.0.0.1') && port !== '3000') {
            return 'http://localhost:3000/api';
        }
        return `${origin}/api`;
    }
};

/**
 * Realiza peticiones HTTP de forma segura procesando JSON y capturando respuestas vacías o no válidas
 */
async function safeFetchJson(url, options = {}) {
    let res;
    try {
        res = await fetch(url, options);
    } catch (netErr) {
        // Fallback si falla la conexión y no se usaba la extensión .php
        if (!url.includes('.php') && window.location.protocol !== 'file:') {
            const phpUrl = url.replace(/\/api\/([^?#]+)/, '/api/$1.php');
            try {
                res = await fetch(phpUrl, options);
            } catch (e) {
                throw netErr;
            }
        } else {
            throw netErr;
        }
    }

    if (!res.ok && res.status === 404 && !url.includes('.php')) {
        // Verificar si el 404 es una respuesta válida del negocio (ej. paciente no encontrado)
        // o si realmente el endpoint no existe (debería intentar PHP)
        const cloned = res.clone();
        let esRespuestaNegocio = false;
        let jsonNegocio = null;
        try {
            const json = await cloned.json();
            if (json && typeof json === 'object') {
                esRespuestaNegocio = true;
                jsonNegocio = json;
            }
        } catch (e) {}

        // Si es una respuesta JSON válida del servidor (lógica de negocio), devolverla directamente
        if (esRespuestaNegocio) {
            return jsonNegocio;
        }

        // Solo intentar fallback PHP para endpoints base (sin parámetros de ruta tipo /pacientes/12345)
        const apiPath = url.replace(/.*\/api\//, '');
        const isSimpleEndpoint = /^[a-zA-Z_]+(\?.*)?$/.test(apiPath);
        if (isSimpleEndpoint) {
            const phpUrl = url.replace(/\/api\/([^?#]+)/, '/api/$1.php');
            try {
                const resPhp = await fetch(phpUrl, options);
                if (resPhp.ok || resPhp.status !== 404) {
                    res = resPhp;
                }
            } catch (e) {}
        }
    }

    const text = await res.text();
    if (!text || !text.trim()) {
        return { error: true, mensaje: "El servidor devolvió una respuesta vacía. Verifique que la API esté en ejecución." };
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Respuesta no válida del servidor:", text);
        return { error: true, mensaje: `Respuesta no válida del servidor (HTTP ${res.status}).` };
    }
}

const API = {
    // ------------------------------------------------------------
    // MÓDULO 1: USUARIOS Y AUTENTICACIÓN
    // ------------------------------------------------------------
    usuarios: {
        /**
         * GET /api/usuarios
         * Obtiene la lista completa de usuarios registrados en MySQL
         */
        async listar() {
            try {
                const json = await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/usuarios`);
                return (json && !json.error && Array.isArray(json.datos)) ? json.datos : [];
            } catch (e) {
                console.warn("Error al listar usuarios desde la API:", e);
                return [];
            }
        },

        /**
         * POST /api/usuarios  (action: 'login')
         * Autentica un usuario contra la base de datos MySQL
         */
        async login(usuario, pass) {
            try {
                return await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'login', usuario, pass })
                });
            } catch (e) {
                console.warn("Error al autenticar en la API:", e);
                return { error: true, mensaje: e.message || "Error de conexión con el servidor." };
            }
        },

        /**
         * POST /api/usuarios
         * Registra un nuevo usuario en la base de datos MySQL
         */
        async registrar(datos) {
            try {
                return await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
            } catch (e) {
                console.warn("Error al registrar usuario en la API:", e);
                return { error: true, mensaje: e.message || "Error de conexión con el servidor." };
            }
        }
    },

    // ------------------------------------------------------------
    // MÓDULO 2: PACIENTES Y FILIACIÓN
    // ------------------------------------------------------------
    pacientes: {
        /**
         * GET /api/pacientes
         * Obtiene la lista completa de pacientes desde MySQL
         */
        async listar() {
            try {
                const json = await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/pacientes`);
                return (json && !json.error && Array.isArray(json.datos)) ? json.datos : [];
            } catch (e) {
                console.warn("Error al listar pacientes desde la API:", e);
                return [];
            }
        },

        /**
         * GET /api/pacientes/:dni
         * Buscar paciente por DNI o ID y devolver sus datos junto con su dirección/ficha
         */
        async buscarPorDni(dni) {
            try {
                const json = await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/pacientes/${encodeURIComponent(dni)}`);
                if (json && json.encontrado && json.paciente) {
                    return json.paciente;
                }
                return null;
            } catch (e) {
                console.warn("Error al buscar paciente por DNI en la API:", e);
                return null;
            }
        },

        /**
         * POST /api/pacientes
         * Registrar un nuevo paciente en la tabla 'persona'
         */
        async registrar(datosPaciente) {
            try {
                return await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/pacientes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosPaciente)
                });
            } catch (e) {
                console.warn("Error al registrar paciente en la API:", e);
                return { error: true, mensaje: e.message || "Error de conexión al registrar paciente." };
            }
        }
    },

    // ------------------------------------------------------------
    // MÓDULO 3: ATENCIONES CLÍNICAS Y TRIAJE
    // ------------------------------------------------------------
    atenciones: {
        /**
         * GET /api/atenciones
         * Lista las atenciones con filtros opcionales de DNI y diagnóstico desde MySQL
         */
        async listar(filtroDni = '', filtroDiag = 'TODOS') {
            try {
                const params = new URLSearchParams();
                if (filtroDni) params.append('dni', filtroDni);
                if (filtroDiag && filtroDiag !== 'TODOS') params.append('diagnostico', filtroDiag);

                const json = await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/atenciones?${params.toString()}`);
                return (json && !json.error && Array.isArray(json.datos)) ? json.datos : [];
            } catch (e) {
                console.warn("Error al listar atenciones desde la API:", e);
                return [];
            }
        },

        /**
         * POST /api/atenciones
         * Guardar un nuevo registro de atención/triaje IRA/EDA
         */
        async registrar(datosAtencion) {
            try {
                return await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/atenciones`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosAtencion)
                });
            } catch (e) {
                console.warn("Error al guardar atención en la API:", e);
                return { error: true, mensaje: e.message || "Error de conexión al registrar atención." };
            }
        }
    },

    // ------------------------------------------------------------
    // MÓDULO 4: BOTIQUÍN E INVENTARIO
    // ------------------------------------------------------------
    botiquin: {
        /**
         * GET /api/botiquin
         * Obtiene la lista de medicamentos e insumos del inventario desde MySQL
         */
        async listar() {
            try {
                const json = await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/botiquin`);
                return (json && !json.error && Array.isArray(json.datos)) ? json.datos : [];
            } catch (e) {
                console.warn("Error al listar botiquín desde la API:", e);
                return [];
            }
        },

        /**
         * POST /api/botiquin
         * Agrega o actualiza un medicamento en el inventario de MySQL
         */
        async agregarOActualizar(datosMedicamento) {
            try {
                return await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/botiquin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosMedicamento)
                });
            } catch (e) {
                console.warn("Error al registrar medicamento en la API:", e);
                return { error: true, mensaje: e.message || "Error de conexión al registrar medicamento." };
            }
        },

        /**
         * POST /api/botiquin/descontar
         * Descuenta stock de un medicamento por código en MySQL
         */
        async descontar(codigo, cantidad = 1) {
            try {
                return await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/botiquin/descontar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ codigo, cantidad })
                });
            } catch (e) {
                console.warn("Error al descontar stock en la API:", e);
                return { error: true, mensaje: e.message || "Error de conexión al descontar stock." };
            }
        }
    },

    // ------------------------------------------------------------
    // MÓDULO 5: DERIVACIONES
    // ------------------------------------------------------------
    derivaciones: {
        /**
         * GET /api/derivaciones
         * Obtiene la lista completa de derivaciones en MySQL
         */
        async listar() {
            try {
                const json = await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/derivaciones`);
                return (json && !json.error && Array.isArray(json.datos)) ? json.datos : [];
            } catch (e) {
                console.warn("Error al listar derivaciones desde la API:", e);
                return [];
            }
        },

        /**
         * POST /api/derivaciones
         * Registra una nueva derivación de paciente en MySQL
         */
        async registrar(datosDerivacion) {
            try {
                return await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/derivaciones`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosDerivacion)
                });
            } catch (e) {
                console.warn("Error al registrar derivación en la API:", e);
                return { error: true, mensaje: e.message || "Error de conexión al registrar derivación." };
            }
        }
    },

    // ------------------------------------------------------------
    // MÓDULO 6: REPORTES Y VIGILANCIA
    // ------------------------------------------------------------
    reportes: {
        /**
         * GET /api/reportes
         * Obtiene las estadísticas epidemiológicas desde MySQL
         */
        async obtenerEstadisticas() {
            try {
                const json = await safeFetchJson(`${ApiConfig.obtenerBaseUrl()}/reportes`);
                return (json && !json.error && json.estadisticas) ? json.estadisticas : null;
            } catch (e) {
                console.warn("Error al obtener reportes desde la API:", e);
                return null;
            }
        }
    }
};
