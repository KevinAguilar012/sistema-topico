// ================================================================
// SISTEMA INTEGRAL DEL TÓPICO - CLIENTE API (FRONTEND <-> BACKEND NODE.JS)
// Conexión REST exclusiva hacia el Servidor Node.js + Express + MySQL
// en http://localhost:3000/api
// ================================================================

const ApiConfig = {
    // URL base del servidor Node.js + Express
    obtenerBaseUrl() {
        if (window.location.origin.includes(':3000')) {
            return `${window.location.origin}/api`;
        }
        return 'http://localhost:3000/api';
    }
};

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
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/usuarios`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                return json.error ? [] : json.datos;
            } catch (e) {
                console.warn("Error al listar usuarios desde la API Node.js:", e);
                return [];
            }
        },

        /**
         * POST /api/usuarios  (action: 'login')
         * Autentica un usuario contra la base de datos MySQL
         */
        async login(usuario, pass) {
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'login', usuario, pass })
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al autenticar en API Node.js:", e);
                return { error: true, mensaje: e.message || "Error de red al autenticar." };
            }
        },

        /**
         * POST /api/usuarios
         * Registra un nuevo usuario en la base de datos MySQL
         */
        async registrar(datos) {
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al registrar usuario en API Node.js:", e);
                return { error: true, mensaje: e.message || "Error de red al registrar usuario." };
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
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/pacientes`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                return json.error ? [] : json.datos;
            } catch (e) {
                console.warn("Error al listar pacientes desde API Node.js:", e);
                return [];
            }
        },

        /**
         * GET /api/pacientes/:dni
         * Buscar paciente por DNI o ID y devolver sus datos junto con su dirección/ficha
         */
        async buscarPorDni(dni) {
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/pacientes/${encodeURIComponent(dni)}`);
                if (res.status === 404) {
                    console.log(`Paciente DNI ${dni} no encontrado (404).`);
                    return null;
                }
                if (!res.ok) {
                    throw new Error(`Respuesta HTTP de error: ${res.status}`);
                }
                const json = await res.json();
                return json.encontrado ? json.paciente : null;
            } catch (e) {
                console.warn("Error al buscar paciente por DNI en API Node.js:", e);
                return null;
            }
        },

        /**
         * POST /api/pacientes
         * Registrar un nuevo paciente en la tabla 'persona'
         */
        async registrar(datosPaciente) {
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/pacientes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosPaciente)
                });
                const json = await res.json();
                if (!res.ok) {
                    return { error: true, mensaje: json.mensaje || `Error HTTP ${res.status}` };
                }
                return json;
            } catch (e) {
                console.warn("Error al registrar paciente en API Node.js:", e);
                return { error: true, mensaje: e.message || "Error de red al registrar paciente." };
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

                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/atenciones?${params.toString()}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                return json.error ? [] : json.datos;
            } catch (e) {
                console.warn("Error al listar atenciones desde API Node.js:", e);
                return [];
            }
        },

        /**
         * POST /api/atenciones
         * Guardar un nuevo registro de atención/triaje IRA/EDA
         */
        async registrar(datosAtencion) {
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/atenciones`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosAtencion)
                });
                const json = await res.json();
                if (!res.ok) {
                    return { error: true, mensaje: json.mensaje || `Error HTTP ${res.status}` };
                }
                return json;
            } catch (e) {
                console.warn("Error al guardar atención en API Node.js:", e);
                return { error: true, mensaje: e.message || "Error de red al registrar atención." };
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
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/botiquin`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                return json.error ? [] : json.datos;
            } catch (e) {
                console.warn("Error al listar botiquín desde API Node.js:", e);
                return [];
            }
        },

        /**
         * POST /api/botiquin
         * Agrega o actualiza un medicamento en el inventario de MySQL
         */
        async agregarOActualizar(datosMedicamento) {
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/botiquin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosMedicamento)
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al registrar medicamento en API Node.js:", e);
                return { error: true, mensaje: e.message || "Error de red al registrar medicamento." };
            }
        },

        /**
         * POST /api/botiquin/descontar
         * Descuenta stock de un medicamento por código en MySQL
         */
        async descontar(codigo, cantidad = 1) {
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/botiquin/descontar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ codigo, cantidad })
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al descontar stock en API Node.js:", e);
                return { error: true, mensaje: e.message || "Error de red al descontar stock." };
            }
        }
    },

    // ------------------------------------------------------------
    // MÓDULO 5: DERIVACIONES
    // ------------------------------------------------------------
    derivaciones: {
        /**
         * POST /api/derivaciones
         * Registra una nueva derivación de paciente en MySQL
         */
        async registrar(datosDerivacion) {
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/derivaciones`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosDerivacion)
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al registrar derivación en API Node.js:", e);
                return { error: true, mensaje: e.message || "Error de red al registrar derivación." };
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
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/reportes`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                return json.error ? null : json.estadisticas;
            } catch (e) {
                console.warn("Error al obtener reportes desde API Node.js:", e);
                return null;
            }
        }
    }
};
