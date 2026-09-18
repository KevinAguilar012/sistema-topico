// ================================================================
// SISTEMA INTEGRAL DEL TÓPICO INSTITUCIONAL - IESTP CARHUAZ
// CONTROLADOR PRINCIPAL (FRONTEND CON CONEXIÓN NODE.JS / MYSQL + FALLBACK LOCAL)
// ================================================================

// ================================================================
// 1. PERSISTENCIA LOCAL (LOCALSTORAGE / CACHÉ LOCAL)
// ================================================================
const obtenerStorage = (clave, defecto) => {
    try {
        const datos = localStorage.getItem(clave);
        return datos ? JSON.parse(datos) : defecto;
    } catch (e) {
        return defecto;
    }
};

const guardarStorage = (clave, datos) => {
    try {
        localStorage.setItem(clave, JSON.stringify(datos));
    } catch (e) {
        console.warn("No se pudo guardar en LocalStorage:", e);
    }
};

// Bases de datos locales (con datos iniciales por defecto)
let listaPacientes = obtenerStorage('topico_pacientes', []);
let listaAtenciones = obtenerStorage('topico_atenciones', []);
let listaBotiquin = obtenerStorage('topico_botiquin', [
    { codigo: 'MED-001', nombre: 'Paracetamol 500mg', categoria: 'Tratamiento IRA', stock: 50, vencimiento: '2027-12-31' },
    { codigo: 'MED-002', nombre: 'Sales de Rehidratación Oral (SRO)', categoria: 'Tratamiento EDA', stock: 40, vencimiento: '2027-10-15' },
    { codigo: 'MED-003', nombre: 'Ibuprofeno 400mg', categoria: 'Primeros Auxilios', stock: 30, vencimiento: '2027-08-20' }
]);
let listaUsuarios = obtenerStorage('topico_usuarios', [
    { nombre: 'Lic. Enfermería Tópico', cep: 'CEP-45123', usuario: 'admin', pass: '1234', turno: 'Mañana' }
]);

// ================================================================
// 2. SINCRONIZACIÓN CON BASE DE DATOS MYSQL (VÍA API NODE.JS)
// ================================================================
async function sincronizarConBaseDatos() {
    if (typeof API === 'undefined' || !ApiConfig.conectadoABaseDatos) return;

    try {
        // A. Sincronizar Usuarios
        const usuariosBD = await API.usuarios.listar();
        if (usuariosBD && Array.isArray(usuariosBD) && usuariosBD.length > 0) {
            listaUsuarios = usuariosBD;
            guardarStorage('topico_usuarios', listaUsuarios);
        }

        // B. Sincronizar Pacientes
        const pacientesBD = await API.pacientes.listar();
        if (pacientesBD && Array.isArray(pacientesBD)) {
            listaPacientes = pacientesBD.map(p => ({
                historiaClinica: p.historia_clinica || p.historiaClinica,
                establecimiento: p.establecimiento || 'IESTP CARHUAZ - TÓPICO INSTITUCIONAL',
                fechaRegistro: p.fecha_registro || p.fechaRegistro,
                dni: p.dni,
                apePaterno: p.ape_paterno || p.apePaterno,
                apeMaterno: p.ape_materno || p.apeMaterno,
                nombres: p.nombres,
                fechaNacimiento: p.fecha_nacimiento || p.fechaNacimiento,
                edad: p.edad || 0,
                genero: p.genero,
                nacionalidad: p.nacionalidad || 'Peruana',
                etnia: p.etnia,
                programa: p.programa || 'Enfermería Técnica',
                telefono: p.telefono,
                dep: p.departamento || p.dep || 'Ancash',
                prov: p.provincia || p.prov || 'Carhuaz',
                dist: p.distrito || p.dist || 'Carhuaz',
                domicilio: p.domicilio,
                referencia: p.referencia,
                apoderado: p.apoderado || {
                    dni: p.apoderado_dni || '',
                    nombres: p.apoderado_nombres || '',
                    vinculo: p.apoderado_vinculo || '',
                    telefono: p.apoderado_telefono || '',
                    ocupacion: p.apoderado_ocupacion || '',
                    domicilio: p.apoderado_domicilio || ''
                }
            }));
            guardarStorage('topico_pacientes', listaPacientes);
        }

        // C. Sincronizar Atenciones
        const atencionesBD = await API.atenciones.listar();
        if (atencionesBD && Array.isArray(atencionesBD)) {
            listaAtenciones = atencionesBD;
            guardarStorage('topico_atenciones', listaAtenciones);
        }

        // D. Sincronizar Botiquín
        const botiquinBD = await API.botiquin.listar();
        if (botiquinBD && Array.isArray(botiquinBD) && botiquinBD.length > 0) {
            listaBotiquin = botiquinBD.map(m => ({
                id: m.id,
                codigo: m.codigo || `MED-00${m.id}`,
                nombre: m.nombre,
                categoria: m.categoria || 'General',
                stock: parseInt(m.stock || 50, 10),
                vencimiento: m.vencimiento || '2027-12-31'
            }));
            guardarStorage('topico_botiquin', listaBotiquin);
        }

        console.log("✅ Datos sincronizados correctamente con MySQL via Node.js API.");
    } catch (error) {
        console.warn("Aviso: No se pudo completar la sincronización con MySQL:", error);
    }
}

function actualizarEstadoUI(conectado) {
    const badge = document.getElementById('dbStatusBadge');
    const loginDot = document.getElementById('loginDbDot');
    const loginText = document.getElementById('loginDbText');

    if (conectado) {
        if (badge) {
            badge.className = 'db-status-badge db-online';
            badge.innerHTML = '🟢 BD MySQL Conectada (Node.js API)';
            badge.title = 'Conexión activa con MySQL (http://localhost:3000/api)';
        }
        if (loginDot) loginDot.innerText = '🟢';
        if (loginText) {
            loginText.innerText = 'Conectada a MySQL (http://localhost:3000/api)';
            loginText.style.color = '#276749';
        }
    } else {
        if (badge) {
            badge.className = 'db-status-badge db-offline';
            badge.innerHTML = '🟡 Modo Local (Sin BD)';
            badge.title = 'Servidor backend no detectado. Los datos se guardan en el navegador localmente.';
        }
        if (loginDot) loginDot.innerText = '🟡';
        if (loginText) {
            loginText.innerText = 'Modo Local (Inicia el servidor Node.js en port 3000 para conectar)';
            loginText.style.color = '#975a16';
        }
    }
}

// ================================================================
// 3. INICIALIZACIÓN DEL SISTEMA
// ================================================================
document.addEventListener('DOMContentLoaded', async () => {

    if (typeof inicializarUbigeo === 'function') {
        inicializarUbigeo();
    }
    
    // Toggle visibilidad del apoderado según programa
    toggleApoderadoF1();

    // Autoasignar fecha y hora actual en los formularios
    const ahora = new Date();
    const offset = ahora.getTimezoneOffset() * 60000;
    const horaLocal = new Date(ahora.getTime() - offset);

    const fechaHoraLocal = horaLocal.toISOString().slice(0, 16);

    const f1FechaHoraReg = document.getElementById('f1FechaHoraReg');
    if (f1FechaHoraReg) f1FechaHoraReg.value = fechaHoraLocal;

    const edaFechaHora = document.getElementById('edaFechaHora');
    if (edaFechaHora) edaFechaHora.value = fechaHoraLocal;

    // Verificar conexión a la Base de Datos Node.js
    if (typeof API !== 'undefined') {
        const dbActiva = await API.verificarConexion();
        actualizarEstadoUI(dbActiva);
        if (dbActiva) {
            await sincronizarConBaseDatos();
        }
    }

    // ------------------------------------------------------------
    // LOGIN
    // ------------------------------------------------------------
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const u = document.getElementById('username').value.trim();
            const p = document.getElementById('password').value.trim();
            const errorMsg = document.getElementById('errorMsg');

            let usuarioValido = false;
            let nombreMostrar = `Lic. ${u}`;

            // Intento 1: Autenticar mediante API en Base de Datos MySQL
            if (typeof API !== 'undefined' && ApiConfig.conectadoABaseDatos) {
                try {
                    const res = await API.usuarios.login(u, p);
                    if (res && !res.error && res.usuario) {
                        usuarioValido = true;
                        nombreMostrar = res.usuario.nombre || `Lic. ${u}`;
                    } else if (res && res.error) {
                        if (errorMsg) {
                            errorMsg.innerText = res.mensaje || "Usuario o contraseña incorrectos.";
                        }
                    }
                } catch (err) {
                    console.warn("Error durante login API:", err);
                }
            } else {
                // Intento 2: Modo sin conexión a BD - Validar con lista local exacta
                const usrLocal = listaUsuarios.find(usr => usr.usuario === u && (usr.pass === p || (!usr.pass && p === '1234')));
                if (usrLocal) {
                    usuarioValido = true;
                    nombreMostrar = usrLocal.nombre;
                } else if (u === 'admin' && p === '1234') {
                    usuarioValido = true;
                    nombreMostrar = 'Administrador';
                }
            }

            if (usuarioValido) {
                document.getElementById('loginView').classList.add('hidden');
                document.getElementById('dashboardView').classList.remove('hidden');
                document.getElementById('userDisplayName').innerText = nombreMostrar;
                
                renderizarTablaBotiquin();
                renderizarTablaUsuarios();
                actualizarReportesF6();
                renderizarTablaF3();
                if (errorMsg) errorMsg.classList.add('hidden');
            } else {
                if (errorMsg) errorMsg.classList.remove('hidden');
            }
        });
    }

    // ------------------------------------------------------------
    // LOGOUT
    // ------------------------------------------------------------
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('dashboardView').classList.add('hidden');
            document.getElementById('loginView').classList.remove('hidden');
        });
    }

    // ------------------------------------------------------------
    // FORMULARIO 1: REGISTRO Y FILIACIÓN COMPLETA
    // ------------------------------------------------------------
    const formF1 = document.getElementById('formF1Paciente');
    if (formF1) {
        formF1.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dni = document.getElementById('f1Dni').value.trim();

            if (listaPacientes.some(p => p.dni === dni)) {
                alert(`⚠️ El paciente con DNI ${dni} ya se encuentra registrado con una Historia Clínica.`);
                return;
            }

            const paciente = {
                establecimiento: document.getElementById('f1Establecimiento').value,
                fechaRegistro: document.getElementById('f1FechaHoraReg').value,
                historiaClinica: document.getElementById('f1NumHistoria').value.trim(),
                dni: dni,
                apePaterno: document.getElementById('f1ApePaterno').value.trim(),
                apeMaterno: document.getElementById('f1ApeMaterno').value.trim(),
                nombres: document.getElementById('f1Nombres').value.trim(),
                fechaNacimiento: document.getElementById('f1FechaNac').value,
                edad: document.getElementById('f1Edad').value,
                genero: document.getElementById('f1Genero').value,
                nacionalidad: document.getElementById('f1Nacionalidad').value.trim(),
                etnia: document.getElementById('f1Etnia').value,
                programa: document.getElementById('f1Programa').value,
                telefono: document.getElementById('f1Telefono').value.trim(),
                dep: document.getElementById('f1Dep').value.trim(),
                prov: document.getElementById('f1Prov').value.trim(),
                dist: document.getElementById('f1Dist').value.trim(),
                domicilio: document.getElementById('f1Domicilio').value.trim(),
                referencia: document.getElementById('f1Referencia').value.trim(),
                apoderado: {
                    dni: document.getElementById('f1ApoDni')?.value.trim() || '',
                    nombres: document.getElementById('f1ApoNombres')?.value.trim() || '',
                    vinculo: document.getElementById('f1ApoVinculo')?.value || '',
                    telefono: document.getElementById('f1ApoTelefono')?.value.trim() || '',
                    ocupacion: document.getElementById('f1ApoOcupacion')?.value.trim() || '',
                    domicilio: document.getElementById('f1ApoDomicilio')?.value.trim() || ''
                }
            };

            // Guardar en MySQL vía API Node.js si está conectada
            let guardadoEnBD = false;
            if (typeof API !== 'undefined' && ApiConfig.conectadoABaseDatos) {
                try {
                    const res = await API.pacientes.registrar(paciente);
                    if (res && res.error) {
                        alert(`❌ Error al guardar paciente en MySQL: ${res.mensaje}`);
                        return;
                    }
                    guardadoEnBD = true;
                } catch (err) {
                    console.warn("Error al registrar paciente en API:", err);
                }
            }

            listaPacientes.push(paciente);
            guardarStorage('topico_pacientes', listaPacientes);

            const mensajeExito = `✅ Historia Clínica ${paciente.historiaClinica} registrada con éxito para ${paciente.nombres} ${paciente.apePaterno}.` +
                                 (guardadoEnBD ? '\n(💾 Guardado en Base de Datos MySQL via Node.js API)' : '\n(📁 Guardado en Modo Local)');
            alert(mensajeExito);
            formF1.reset();
            toggleApoderadoF1();
            
            if (f1FechaHoraReg) f1FechaHoraReg.value = new Date().toISOString().slice(0, 16);
        });

        formF1.addEventListener('reset', () => {
            setTimeout(toggleApoderadoF1, 0);
        });
    }

    // ------------------------------------------------------------
    // FORMULARIO 2: ATENCIÓN CLÍNICA Y TRIAJE
    // ------------------------------------------------------------
    const formF2 = document.getElementById('formF2Atencion');
    if (formF2) {
        formF2.addEventListener('submit', async (e) => {
            e.preventDefault();

            const dni = document.getElementById('f2Dni').value;
            if (!dni) {
                alert("⚠️ Primero debe buscar y cargar los datos de un paciente por su DNI.");
                return;
            }

            const diagPrincipal = document.getElementById('f2DiagnosticoMain').value;
            if (!diagPrincipal) {
                alert("⚠️ Seleccione el Tipo de Diagnóstico / Evaluación (IRA, EDA o General).");
                return;
            }

            let temp = "36.5";
            let subtipo = "Atención General";
            let tratamiento = "";
            let destino = "Tópico / Reposo";

            if (diagPrincipal === 'IRA') {
                temp = document.getElementById('iraTemp')?.value || '36.5';
                subtipo = document.getElementById('iraClasificacion')?.value || 'IRA sin especificar';
                tratamiento = `${document.getElementById('iraMedicamento')?.value || ''} ${document.getElementById('iraDosis')?.value || ''}`.trim();
                destino = document.getElementById('iraReferencia')?.value || 'Atención en Tópico';
            } else if (diagPrincipal === 'EDA') {
                temp = document.getElementById('edaTemp')?.value || '36.5';
                const estadoHid = document.getElementById('edaEstadoHidratacion')?.value || '';
                const tipoDiarrea = document.getElementById('edaTipoDiarrea')?.value || '';
                subtipo = [estadoHid, tipoDiarrea].filter(Boolean).join(' | ') || 'EDA Adultos';
                
                const manejoFluidos = document.getElementById('edaManejoFluidos')?.value || 'Hidratación vía oral';
                const tratFarmac = document.getElementById('edaTratFarmacologico')?.value || 'Ninguno';
                tratamiento = `${manejoFluidos} | ${tratFarmac}`;

                destino = estadoHid.includes('grave') || manejoFluidos.includes('intravenosa') ? 'Referido URGENTE (IV)' : 'Ambulatorio';
            }

            const atencion = {
                id: Date.now(),
                fecha: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                dni: dni,
                paciente: document.getElementById('f2NombreCompleto').value,
                programa: document.getElementById('f2Programa').value,
                temp: temp,
                diagnostico: diagPrincipal,
                subtipo: subtipo,
                tratamiento: tratamiento,
                destino: destino,
                licenciada: document.getElementById('userDisplayName').innerText
            };

            // Guardar en MySQL vía API Node.js si está conectada
            let guardadoEnBD = false;
            if (typeof API !== 'undefined' && ApiConfig.conectadoABaseDatos) {
                try {
                    const res = await API.atenciones.registrar(atencion);
                    if (res && res.error) {
                        alert(`❌ Error al guardar atención en Base de Datos: ${res.mensaje}`);
                        return;
                    }
                    guardadoEnBD = true;
                } catch (err) {
                    console.warn("Error al guardar atención en API:", err);
                }
            }

            listaAtenciones.push(atencion);
            guardarStorage('topico_atenciones', listaAtenciones);
            
            // Descontar medicamento según corresponda
            descontarStockBotiquin(diagPrincipal);

            // Mostrar Receta médica
            mostrarModalReceta(atencion);

            // Limpieza del formulario
            formF2.reset();
            document.getElementById('f2BuscarDni').value = "";
            document.getElementById('f2Dni').value = "";
            document.getElementById('f2NombreCompleto').value = "";
            document.getElementById('f2Programa').value = "";

            const infoCard = document.getElementById('pacienteEncontradoInfo');
            if (infoCard) infoCard.classList.add('hidden');
            
            cambiarFichaAtencion('');

            // Actualizar tablas y reportes
            renderizarTablaF3();
            actualizarReportesF6();
        });
    }

    // ------------------------------------------------------------
    // FORMULARIO 4: BOTIQUÍN
    // ------------------------------------------------------------
    const formF4 = document.getElementById('formF4Medicamento');
    if (formF4) {
        formF4.addEventListener('submit', async (e) => {
            e.preventDefault();
            const codigo = document.getElementById('f4Codigo').value.trim().toUpperCase();
            const nombre = document.getElementById('f4Nombre').value.trim();
            const categoria = document.getElementById('f4Categoria').value;
            const cantidad = parseInt(document.getElementById('f4Cantidad').value, 10);
            const vencimiento = document.getElementById('f4Vencimiento').value;

            // Guardar en MySQL si la API está disponible
            let guardadoEnBD = false;
            if (typeof API !== 'undefined' && ApiConfig.conectadoABaseDatos) {
                try {
                    const res = await API.botiquin.agregarOActualizar({
                        codigo, nombre, categoria, cantidad, vencimiento
                    });
                    if (res && !res.error) guardadoEnBD = true;
                } catch (err) {
                    console.warn("Error en botiquín API:", err);
                }
            }

            // Actualizar almacenamiento local
            const existente = listaBotiquin.find(m => m.codigo === codigo);
            if (existente) {
                existente.stock += cantidad;
                existente.vencimiento = vencimiento;
                alert(`✅ Stock incrementado para el insumo ${existente.nombre}.` + (guardadoEnBD ? '\n(💾 Actualizado en MySQL via Node.js)' : ''));
            } else {
                const med = {
                    codigo: codigo,
                    nombre: nombre,
                    categoria: categoria,
                    stock: cantidad,
                    vencimiento: vencimiento
                };
                listaBotiquin.push(med);
                alert("✅ Nuevo medicamento añadido al botiquín." + (guardadoEnBD ? '\n(💾 Guardado en MySQL via Node.js)' : ''));
            }

            guardarStorage('topico_botiquin', listaBotiquin);
            formF4.reset();
            renderizarTablaBotiquin();
        });
    }

    // ------------------------------------------------------------
    // FORMULARIO 5: DERIVACIÓN Y REFERENCIAS
    // ------------------------------------------------------------
    const formF5 = document.getElementById('formF5Derivacion');
    if (formF5) {
        formF5.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dni = document.getElementById('f5Dni').value.trim();
            const pac = listaPacientes.find(p => p.dni === dni);
            const nom = pac ? `${pac.apePaterno} ${pac.nombres}` : `DNI ${dni}`;
            const destino = document.getElementById('f5Establecimiento').value;
            const motivo = document.getElementById('f5Motivo').value;
            const acomp = document.getElementById('f5Acompanante')?.value || '';

            let guardadoEnBD = false;
            if (typeof API !== 'undefined' && ApiConfig.conectadoABaseDatos) {
                try {
                    const res = await API.derivaciones.registrar({
                        dni,
                        paciente: nom,
                        establecimiento: destino,
                        motivo: motivo,
                        acompanante: acomp,
                        personal: document.getElementById('userDisplayName')?.innerText || 'Lic. Enfermería'
                    });
                    if (res && !res.error) guardadoEnBD = true;
                } catch (err) {
                    console.warn("Error en derivaciones API:", err);
                }
            }

            alert(`🚑 FICHA DE REFERENCIA GENERADA\n\nPaciente: ${nom}\nDestino: ${destino}\nMotivo: ${motivo}` +
                  (guardadoEnBD ? '\n\n(💾 Registrado en Base de Datos MySQL via Node.js)' : ''));
            formF5.reset();
        });
    }

    // ------------------------------------------------------------
    // FORMULARIO 7: REGISTRO DE PERSONAL
    // ------------------------------------------------------------
    const formF7 = document.getElementById('formF7Usuario');
    if (formF7) {
        formF7.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usr = {
                nombre: document.getElementById('f7Nombre').value.trim(),
                cep: document.getElementById('f7Cep').value.trim(),
                usuario: document.getElementById('f7User').value.trim(),
                pass: document.getElementById('f7Pass').value.trim(),
                turno: document.getElementById('f7Turno').value
            };

            let guardadoEnBD = false;
            if (typeof API !== 'undefined' && ApiConfig.conectadoABaseDatos) {
                try {
                    const res = await API.usuarios.registrar(usr);
                    if (res && !res.error) guardadoEnBD = true;
                } catch (err) {
                    console.warn("Error en usuarios API:", err);
                }
            }

            listaUsuarios.push(usr);
            guardarStorage('topico_usuarios', listaUsuarios);
            alert("👤 Personal registrado exitosamente." + (guardadoEnBD ? '\n(💾 Guardado en MySQL via Node.js)' : ''));
            formF7.reset();
            renderizarTablaUsuarios();
        });
    }
});

// ================================================================
// 4. NAVEGACIÓN ENTRE MÓDULOS
// ================================================================
function mostrarSeccion(idSec) {
    const secciones = ['secF1', 'secF2', 'secF3', 'secF4', 'secF5', 'secF6', 'secF7'];
    secciones.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.classList.add('hidden');
    });

    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));

    const mapeo = {
        'f1_paciente': 'secF1',
        'f2_atencion': 'secF2',
        'f3_historial': 'secF3',
        'f4_botiquin': 'secF4',
        'f5_derivacion': 'secF5',
        'f6_reportes': 'secF6',
        'f7_usuarios': 'secF7'
    };

    const secId = mapeo[idSec];
    if (secId) {
        const elem = document.getElementById(secId);
        if (elem) elem.classList.remove('hidden');
    }

    if (idSec === 'f3_historial') renderizarTablaF3();
    if (idSec === 'f4_botiquin') renderizarTablaBotiquin();
    if (idSec === 'f6_reportes') actualizarReportesF6();
    if (idSec === 'f7_usuarios') renderizarTablaUsuarios();
}

// ================================================================
// 5. BÚSQUEDA DE PACIENTE (FORMULARIO 2) - BÚSQUEDA API REST NODE.JS
// ================================================================
async function buscarPacienteF2() {
    const dni = document.getElementById('f2BuscarDni').value.trim();
    if (!dni) {
        alert("Por favor ingrese un número de DNI para la búsqueda.");
        return;
    }

    let paciente = null;

    // 1. Intentar consultar a la API de Node.js en MySQL
    if (typeof API !== 'undefined' && ApiConfig.conectadoABaseDatos) {
        try {
            const pacBD = await API.pacientes.buscarPorDni(dni);
            if (pacBD) {
                const apeMat = (pacBD.ape_materno || pacBD.apeMaterno) ? ` ${pacBD.ape_materno || pacBD.apeMaterno}` : '';
                const nomComp = `${pacBD.ape_paterno || pacBD.apePaterno || ''}${apeMat}, ${pacBD.nombres || ''}`;
                const apoderadoNom = typeof pacBD.apoderado === 'object' ? (pacBD.apoderado?.nombres || '') : (pacBD.apoderado || '');
                
                paciente = {
                    dni: pacBD.dni,
                    nombres: pacBD.nombres,
                    apePaterno: pacBD.ape_paterno || pacBD.apePaterno,
                    apeMaterno: pacBD.ape_materno || pacBD.apeMaterno,
                    nombreCompleto: nomComp.trim().replace(/^,/, ''),
                    edad: pacBD.edad || 20,
                    genero: pacBD.genero || 'No precisa',
                    programa: pacBD.programa || 'Enfermería Técnica',
                    domicilio: pacBD.domicilio || 'Carhuaz',
                    apoderado: apoderadoNom
                };
            }
        } catch (err) {
            console.warn("Aviso al buscar paciente por DNI en API Node.js:", err);
        }
    }

    // 2. Si no se encontró en MySQL/API o la API está inactiva, consultar almacenamiento local
    if (!paciente) {
        const local = listaPacientes.find(p => p.dni === dni);
        if (local) {
            const apeMat = local.apeMaterno ? ` ${local.apeMaterno}` : '';
            const apoderadoNom = typeof local.apoderado === 'object' ? (local.apoderado?.nombres || '') : (local.apoderado || '');
            paciente = {
                dni: local.dni,
                nombres: local.nombres,
                apePaterno: local.apePaterno,
                apeMaterno: local.apeMaterno,
                nombreCompleto: `${local.apePaterno}${apeMat}, ${local.nombres}`,
                edad: local.edad || 20,
                genero: local.genero || local.sexo || 'No precisa',
                programa: local.programa || 'Enfermería Técnica',
                domicilio: local.domicilio || 'Carhuaz',
                apoderado: apoderadoNom
            };
        }
    }

    // 3. Autocompletar la interfaz de usuario (F2, Ficha IRA y Ficha EDA)
    const infoCard = document.getElementById('pacienteEncontradoInfo');

    if (paciente) {
        const generoEdad = `${paciente.edad} años / ${paciente.genero}`;

        // Formulario 2 (Atención Principal)
        if (document.getElementById('f2Dni')) document.getElementById('f2Dni').value = paciente.dni;
        if (document.getElementById('f2NombreCompleto')) document.getElementById('f2NombreCompleto').value = paciente.nombreCompleto;
        if (document.getElementById('f2Programa')) document.getElementById('f2Programa').value = paciente.programa;

        // Ficha de Atención IRA
        if (document.getElementById('iraDni')) document.getElementById('iraDni').value = paciente.dni;
        if (document.getElementById('iraNombreCompleto')) document.getElementById('iraNombreCompleto').value = paciente.nombreCompleto;
        if (document.getElementById('iraEdadSexo')) document.getElementById('iraEdadSexo').value = generoEdad;
        if (document.getElementById('iraDireccion')) document.getElementById('iraDireccion').value = paciente.domicilio;

        // Ficha de Atención EDA
        if (document.getElementById('edaDni')) document.getElementById('edaDni').value = paciente.dni;
        if (document.getElementById('edaNombreCompleto')) document.getElementById('edaNombreCompleto').value = paciente.nombreCompleto;
        if (document.getElementById('edaEdadSexo')) document.getElementById('edaEdadSexo').value = generoEdad;
        if (document.getElementById('edaDireccion')) document.getElementById('edaDireccion').value = paciente.domicilio;
        if (document.getElementById('edaAcompanante')) document.getElementById('edaAcompanante').value = paciente.apoderado;

        if (infoCard) infoCard.classList.remove('hidden');
        alert(`✅ Paciente cargado con éxito: ${paciente.nombreCompleto}`);
    } else {
        alert(`❌ No se encontró ningún paciente con DNI: ${dni}.\nPor favor regístrelo previamente en el módulo 'Nuevo Paciente'.`);
        limpiarCamposPacienteF2();
    }
}

function limpiarCamposPacienteF2() {
    if (document.getElementById('f2Dni')) document.getElementById('f2Dni').value = "";
    if (document.getElementById('f2NombreCompleto')) document.getElementById('f2NombreCompleto').value = "";
    if (document.getElementById('f2Programa')) document.getElementById('f2Programa').value = "";

    const infoCard = document.getElementById('pacienteEncontradoInfo');
    if (infoCard) infoCard.classList.add('hidden');
}

// ================================================================
// 6. GESTIÓN DINÁMICA DE FICHAS (IRA / EDA)
// ================================================================
function cambiarFichaAtencion(tipo) {
    const fichaIRA = document.getElementById('fichaIRA');
    const fichaEDA = document.getElementById('fichaEDA');

    if (fichaIRA) fichaIRA.classList.add('hidden');
    if (fichaEDA) fichaEDA.classList.add('hidden');

    if (tipo === 'IRA' && fichaIRA) {
        fichaIRA.classList.remove('hidden');
    } else if (tipo === 'EDA' && fichaEDA) {
        fichaEDA.classList.remove('hidden');
    }
}

// ================================================================
// 7. MODAL DE RECETA E IMPRESIÓN
// ================================================================
function mostrarModalReceta(atencion) {
    const content = document.getElementById('modalRecetaContent');
    let esquema = "";

    if (atencion.diagnostico === "IRA") {
        esquema = `
            <ul>
                <li><strong>Paracetamol 500mg:</strong> 1 tableta vía oral cada 8 horas por 3 días.</li>
                <li><strong>Medidas Generales:</strong> Reposo relativo, ingesta continua de líquidos tibios.</li>
                <li><strong>Alerta:</strong> Acudir de inmediato si presenta dificultad al respirar o fiebre alta persistente.</li>
            </ul>
        `;
    } else if (atencion.diagnostico === "EDA") {
        esquema = `
            <ul>
                <li><strong>Sales de Rehidratación Oral (SRO):</strong> 1 sobre disuelto en 1 litro de agua hervida fría (beber a libre demanda tras cada deposición).</li>
                <li><strong>Alimentación:</strong> Dieta astringente y blanda (arroz, zanahoria cocida, sopa ligera).</li>
                <li><strong>Alerta:</strong> Acudir si hay vómitos incoercibles o deposiciones con sangre.</li>
            </ul>
        `;
    } else {
        esquema = `<p>Atención general realizada con éxito. Indicaciones brindadas verbalmente en tópico.</p>`;
    }

    content.innerHTML = `
        <div style="border-bottom: 1px dashed #cbd5e0; padding-bottom: 8px; margin-bottom: 8px;">
            <p><strong>Fecha:</strong> ${atencion.fecha}</p>
            <p><strong>Paciente:</strong> ${atencion.paciente} | <strong>DNI:</strong> ${atencion.dni}</p>
            <p><strong>Área / Programa:</strong> ${atencion.programa}</p>
            <p><strong>Diagnóstico:</strong> ${atencion.diagnostico} (${atencion.subtipo})</p>
        </div>
        <h4 style="color: #2b6cb0; margin-bottom: 5px;">Prescripción y Recomendaciones:</h4>
        ${esquema}
        <p style="margin-top: 10px;"><strong>Tratamiento Administrado en Tópico:</strong> ${atencion.tratamiento || 'Ninguno adicional'}</p>
        <p style="margin-top: 10px; font-size: 11px; color: #718096; text-align: right;">Atendido por: ${atencion.licenciada}</p>
    `;

    document.getElementById('modalReceta').classList.remove('hidden');
}

function cerrarModal() {
    window.print();
    document.getElementById('modalReceta').classList.add('hidden');
}

// ================================================================
// 8. TABLA HISTORIAL (FORMULARIO 3)
// ================================================================
function renderizarTablaF3(datos = listaAtenciones) {
    const tbody = document.getElementById('f3TablaBody');
    if (!tbody) return;
    tbody.innerHTML = "";

    if (datos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #a0aec0; padding: 15px;">No hay registros de atenciones médicas.</td></tr>`;
        return;
    }

    const ordenados = [...datos].reverse();

    ordenados.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.fecha}</td>
            <td><strong>${item.dni}</strong></td>
            <td>${item.paciente}</td>
            <td>${item.programa}</td>
            <td><span style="background: #ebf8ff; color: #2b6cb0; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${item.diagnostico}</span></td>
            <td>${item.temp ? item.temp + ' °C' : '-'}</td>
            <td>${item.destino}</td>
            <td>${item.licenciada}</td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrarTablaF3() {
    const texto = (document.getElementById('f3FiltroDni')?.value || '').toLowerCase();
    const diagFiltro = document.getElementById('f3FiltroDiag')?.value || 'TODOS';

    const filtrados = listaAtenciones.filter(item => {
        const coincideTexto = (item.dni || '').toLowerCase().includes(texto) || (item.paciente || '').toLowerCase().includes(texto);
        const coincideDiag = (diagFiltro === "TODOS") || (item.diagnostico === diagFiltro);
        return coincideTexto && coincideDiag;
    });

    renderizarTablaF3(filtrados);
}

// ================================================================
// 9. TABLA BOTIQUÍN (FORMULARIO 4)
// ================================================================
function renderizarTablaBotiquin() {
    const tbody = document.getElementById('f4TablaBody');
    if (!tbody) return;
    tbody.innerHTML = "";

    if (listaBotiquin.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Botiquín vacío.</td></tr>`;
        return;
    }

    listaBotiquin.forEach(item => {
        const tr = document.createElement('tr');
        const bajoStock = item.stock <= 10;
        const estado = bajoStock 
            ? `<span style="color: #e53e3e; font-weight: bold; background: #fff5f5; padding: 2px 5px; border-radius: 4px;">⚠️ Bajo Stock</span>`
            : `<span style="color: #38a169; font-weight: bold; background: #f0fff4; padding: 2px 5px; border-radius: 4px;">✅ Disponible</span>`;

        tr.innerHTML = `
            <td><strong>${item.codigo}</strong></td>
            <td>${item.nombre}</td>
            <td>${item.categoria}</td>
            <td style="font-weight: bold; font-size: 13px;">${item.stock} unidades</td>
            <td>${item.vencimiento}</td>
            <td>${estado}</td>
        `;
        tbody.appendChild(tr);
    });
}

function descontarStockBotiquin(diag) {
    const codigo = diag === 'IRA' ? 'MED-001' : 'MED-002';
    const med = listaBotiquin.find(m => m.codigo === codigo);
    if (med && med.stock > 0) {
        med.stock -= 1;
        guardarStorage('topico_botiquin', listaBotiquin);
        renderizarTablaBotiquin();
    }

    // Descontar en base de datos si la API está conectada
    if (typeof API !== 'undefined' && ApiConfig.conectadoABaseDatos) {
        API.botiquin.descontar(codigo, 1);
    }
}

// ================================================================
// 10. USUARIOS (FORMULARIO 7)
// ================================================================
function renderizarTablaUsuarios() {
    const tbody = document.getElementById('f7TablaBody');
    if (!tbody) return;
    tbody.innerHTML = "";

    listaUsuarios.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${item.nombre}</strong></td>
            <td>${item.cep}</td>
            <td>${item.usuario}</td>
            <td>${item.turno}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ================================================================
// 11. REPORTES Y VIGILANCIA MINSA (FORMULARIO 6)
// ================================================================
function actualizarReportesF6() {
    const iras = listaAtenciones.filter(x => x.diagnostico === 'IRA').length;
    const edas = listaAtenciones.filter(x => x.diagnostico === 'EDA').length;

    const cntIra = document.getElementById('f6CntIra');
    const cntEda = document.getElementById('f6CntEda');
    const cntTotal = document.getElementById('f6CntTotal');

    if (cntIra) cntIra.innerText = iras;
    if (cntEda) cntEda.innerText = edas;
    if (cntTotal) cntTotal.innerText = listaAtenciones.length;

    const programas = [
        "Enfermería Técnica",
        "Arquitectura de Plataformas y Servicios de Tecnologías de la Información",
        "Otros (Docentes, Administrativos y Externos)"
    ];

    const tbody = document.getElementById('f6TablaProgramas');
    if (!tbody) return;
    tbody.innerHTML = "";

    programas.forEach(prog => {
        const cIra = listaAtenciones.filter(x => x.programa === prog && x.diagnostico === 'IRA').length;
        const cEda = listaAtenciones.filter(x => x.programa === prog && x.diagnostico === 'EDA').length;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prog}</td>
            <td style="text-align: center; color: #319795; font-weight: bold;">${cIra}</td>
            <td style="text-align: center; color: #dd6b20; font-weight: bold;">${cEda}</td>
            <td style="text-align: center; font-weight: bold; background: #f7fafc;">${cIra + cEda}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ================================================================
// 12. UTILIDADES DE FORMULARIO
// ================================================================
function calcularEdadF1(fechaNacimiento) {
    if (!fechaNacimiento) return;
    const hoy = new Date();
    const nac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) {
        edad--;
    }

    const inputEdad = document.getElementById('f1Edad');
    if (inputEdad) inputEdad.value = edad >= 0 ? edad : 0;
}

function toggleApoderadoF1() {
    const prog = document.getElementById('f1Programa')?.value;
    const secApo = document.getElementById('secF1Apoderado');
    const apoDni = document.getElementById('f1ApoDni');
    const apoNom = document.getElementById('f1ApoNombres');
    const apoVin = document.getElementById('f1ApoVinculo');
    const apoTel = document.getElementById('f1ApoTelefono');

    const esEstudiante = prog === 'Enfermería Técnica' || prog === 'Arquitectura de Plataformas y Servicios de Tecnologías de la Información';

    if (secApo) {
        if (esEstudiante) {
            secApo.classList.remove('hidden');
            if (apoDni) apoDni.required = true;
            if (apoNom) apoNom.required = true;
            if (apoVin) apoVin.required = true;
            if (apoTel) apoTel.required = true;
        } else {
            secApo.classList.add('hidden');
            if (apoDni) apoDni.required = false;
            if (apoNom) apoNom.required = false;
            if (apoVin) apoVin.required = false;
            if (apoTel) apoTel.required = false;
        }
    }
}

// ================================================================
// 13. AUTOMATIZACIÓN Y REGLAS LÓGICAS PARA EDA
// ================================================================
function evaluarReglasEDA() {
    const estadoHidratacion = document.getElementById('edaEstadoHidratacion')?.value;
    const tipoDiarrea = document.getElementById('edaTipoDiarrea')?.value;

    const manejoFluidos = document.getElementById('edaManejoFluidos');
    const tratFarmacologico = document.getElementById('edaTratFarmacologico');
    const alertaDisenteria = document.getElementById('alertaDisenteria');
    const secConsejeria = document.getElementById('secEdaConsejeria');

    if (estadoHidratacion === 'Sin deshidratación clínica') {
        if (manejoFluidos) manejoFluidos.value = 'Plan A - Hidratación vía oral (Ambulatorio)';
    } 
    else if (estadoHidratacion === 'Deshidratación moderada') {
        if (manejoFluidos) manejoFluidos.value = 'Plan B - Hidratación vía oral supervisada (SRO en centro de salud)';
    } 
    else if (estadoHidratacion === 'Deshidratación grave / Shock hipovolémico') {
        if (manejoFluidos) manejoFluidos.value = 'Plan C - Hidratación intravenosa (Emergencia/Observación)';
        alert("🚨 ¡ALERTA CRÍTICA: DESHIDRATACIÓN GRAVE / SHOCK HIPOVOLÉMICO!\nInicie de inmediato Hidratación Intravenosa de Emergencia (Plan C) y ordene transferencia / evaluación urgente.");
    }

    if (manejoFluidos && manejoFluidos.value.includes('Plan A')) {
        if (secConsejeria) {
            secConsejeria.style.border = '2px solid #3182ce';
            secConsejeria.style.backgroundColor = '#ebf8ff';
        }
        ['edaPrevManos', 'edaPrevAgua', 'edaPrevAlimentos', 'edaAlarmaPersistencia', 'edaAlarmaSangrado'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.checked = true;
        });
    } else {
        if (secConsejeria) {
            secConsejeria.style.border = '1px solid #e2e8f0';
            secConsejeria.style.backgroundColor = '#ffffff';
        }
    }

    if (tipoDiarrea === 'Síndrome disentérico') {
        if (alertaDisenteria) alertaDisenteria.classList.remove('hidden');
        if (tratFarmacologico && tratFarmacologico.value === 'Ninguno') {
            tratFarmacologico.value = 'Antibioticoterapia empírica';
        }
    } else {
        if (alertaDisenteria) alertaDisenteria.classList.add('hidden');
    }
}

function generarHistoriaF1(dni) {
    const numHist = document.getElementById('f1NumHistoria');
    if (numHist) {
        numHist.value = dni.length > 0 ? `HC-${dni}` : '';
    }
}