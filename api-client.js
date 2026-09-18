// ================================================================
// SISTEMA INTEGRAL DEL TÓPICO - CLIENTE API (FRONTEND <-> BACKEND NODE.JS)
// Conexión REST hacia el Servidor Node.js + Express en http://localhost:3000/api
// con respaldo automático a LocalStorage si el servidor backend no responde.
// ================================================================

const ApiConfig = {
    // URL base del servidor Node.js + Express
    obtenerBaseUrl() {
        if (window.location.origin.includes(':3000')) {
            return `${window.location.origin}/api`;
        }
        return 'http://localhost:3000/api';
    },

    conectadoABaseDatos: false
};

const API = {
    /**
     * Comprueba si el backend en Node.js y la base de datos MySQL están activos
     */
    async verificarConexion() {
        try {
            const baseUrl = ApiConfig.obtenerBaseUrl();
            const res = await fetch(`${baseUrl}/health`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!res.ok) {
                ApiConfig.conectadoABaseDatos = false;
                return false;
            }

            const data = await res.json();
            ApiConfig.conectadoABaseDatos = Boolean(data && data.conectado);
            return ApiConfig.conectadoABaseDatos;
        } catch (err) {
            console.warn("Servidor backend Node.js no disponible (se usará Modo Local):", err.message);
            ApiConfig.conectadoABaseDatos = false;
            return false;
        }
    },

    // ------------------------------------------------------------
    // MÓDULO 1: USUARIOS Y AUTENTICACIÓN
    // ------------------------------------------------------------
    usuarios: {
        async listar() {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/usuarios`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                return json.error ? null : json.datos;
            } catch (e) {
                console.warn("Error al listar usuarios desde la API Node.js:", e);
                return null;
            }
        },

        async login(usuario, pass) {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'login', usuario, pass })
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al autenticar en API Node.js:", e);
                return null;
            }
        },

        async registrar(datos) {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al registrar usuario en API Node.js:", e);
                return null;
            }
        }
    },

    // ------------------------------------------------------------
    // MÓDULO 2: PACIENTES Y FILIACIÓN
    // ------------------------------------------------------------
    pacientes: {
        async listar() {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/pacientes`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                return json.error ? null : json.datos;
            } catch (e) {
                console.warn("Error al listar pacientes desde API Node.js:", e);
                return null;
            }
        },

        /**
         * GET /api/pacientes/:dni
         * Buscar paciente por DNI o ID y devolver sus datos junto con su dirección/ficha
         */
        async buscarPorDni(dni) {
            if (!ApiConfig.conectadoABaseDatos) return null;
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
            if (!ApiConfig.conectadoABaseDatos) return null;
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
        async listar(filtroDni = '', filtroDiag = 'TODOS') {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const params = new URLSearchParams();
                if (filtroDni) params.append('dni', filtroDni);
                if (filtroDiag && filtroDiag !== 'TODOS') params.append('diagnostico', filtroDiag);

                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/atenciones?${params.toString()}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                return json.error ? null : json.datos;
            } catch (e) {
                console.warn("Error al listar atenciones desde API Node.js:", e);
                return null;
            }
        },

        /**
         * POST /api/atenciones
         * Guardar un nuevo registro de atención/triaje IRA/EDA
         */
        async registrar(datosAtencion) {
            if (!ApiConfig.conectadoABaseDatos) return null;
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
        async listar() {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/botiquin`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                return json.error ? null : json.datos;
            } catch (e) {
                console.warn("Error al listar botiquín desde API Node.js:", e);
                return null;
            }
        },

        async agregarOActualizar(datosMedicamento) {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/botiquin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosMedicamento)
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al registrar medicamento en API Node.js:", e);
                return null;
            }
        },

        async descontar(codigo, cantidad = 1) {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/botiquin/descontar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ codigo, cantidad })
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al descontar stock en API Node.js:", e);
                return null;
            }
        }
    },

    // ------------------------------------------------------------
    // MÓDULO 5: DERIVACIONES
    // ------------------------------------------------------------
    derivaciones: {
        async registrar(datosDerivacion) {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/derivaciones`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosDerivacion)
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al registrar derivación en API Node.js:", e);
                return null;
            }
        }
    },

    // ------------------------------------------------------------
    // MÓDULO 6: REPORTES Y VIGILANCIA
    // ------------------------------------------------------------
    reportes: {
        async obtenerEstadisticas() {
            if (!ApiConfig.conectadoABaseDatos) return null;
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
