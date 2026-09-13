// ================================================================
// SISTEMA INTEGRAL DEL TÓPICO - CLIENTE API (FRONTEND <-> BACKEND)
// Administra las peticiones hacia la base de datos MySQL (PHP API)
// con respaldo automático a LocalStorage si la BD no está encendida.
// ================================================================

const ApiConfig = {
    // Detectar automáticamente la URL de la API según el entorno
    obtenerBaseUrl() {
        // Si se ejecuta mediante http://localhost o IP
        if (window.location.protocol.startsWith('http')) {
            // Si está dentro de una subcarpeta en htdocs (ej: http://localhost/SISTEMA-TOPICO/)
            const path = window.location.pathname;
            const directorio = path.substring(0, path.lastIndexOf('/'));
            return `${window.location.origin}${directorio}/api`;
        }
        // Si se abrió directamente con doble clic (file://), apuntar a XAMPP por defecto
        return 'http://localhost/SISTEMA-TOPICO/api';
    },

    conectadoABaseDatos: false
};

const API = {
    /**
     * Comprueba si el backend y la base de datos MySQL están activos
     */
    async verificarConexion() {
        try {
            const baseUrl = ApiConfig.obtenerBaseUrl();
            const res = await fetch(`${baseUrl}/test_conexion.php`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            const data = await res.json();
            ApiConfig.conectadoABaseDatos = (res.ok && data.conectado);
            return ApiConfig.conectadoABaseDatos;
        } catch (err) {
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
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/usuarios.php`);
                const json = await res.json();
                return json.error ? null : json.datos;
            } catch (e) {
                console.warn("Error al listar usuarios desde API:", e);
                return null;
            }
        },

        async login(usuario, pass) {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/usuarios.php?action=login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'login', usuario, pass })
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al autenticar en API:", e);
                return null;
            }
        },

        async registrar(datos) {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/usuarios.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al registrar usuario en API:", e);
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
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/pacientes.php`);
                const json = await res.json();
                return json.error ? null : json.datos;
            } catch (e) {
                console.warn("Error al listar pacientes desde API:", e);
                return null;
            }
        },

        async buscarPorDni(dni) {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/pacientes.php?dni=${encodeURIComponent(dni)}`);
                const json = await res.json();
                return json.encontrado ? json.paciente : null;
            } catch (e) {
                console.warn("Error al buscar paciente en API:", e);
                return null;
            }
        },

        async registrar(datosPaciente) {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/pacientes.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosPaciente)
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al registrar paciente en API:", e);
                return null;
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

                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/atenciones.php?${params.toString()}`);
                const json = await res.json();
                return json.error ? null : json.datos;
            } catch (e) {
                console.warn("Error al listar atenciones desde API:", e);
                return null;
            }
        },

        async registrar(datosAtencion) {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/atenciones.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosAtencion)
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al guardar atención en API:", e);
                return null;
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
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/botiquin.php`);
                const json = await res.json();
                return json.error ? null : json.datos;
            } catch (e) {
                console.warn("Error al listar botiquín desde API:", e);
                return null;
            }
        },

        async agregarOActualizar(datosMedicamento) {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/botiquin.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosMedicamento)
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al registrar medicamento en API:", e);
                return null;
            }
        },

        async descontar(codigo, cantidad = 1) {
            if (!ApiConfig.conectadoABaseDatos) return null;
            try {
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/botiquin.php?action=descontar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'descontar', codigo, cantidad })
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al descontar stock en API:", e);
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
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/derivaciones.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosDerivacion)
                });
                return await res.json();
            } catch (e) {
                console.warn("Error al registrar derivación en API:", e);
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
                const res = await fetch(`${ApiConfig.obtenerBaseUrl()}/reportes.php`);
                const json = await res.json();
                return json.error ? null : json.estadisticas;
            } catch (e) {
                console.warn("Error al obtener reportes desde API:", e);
                return null;
            }
        }
    }
};
