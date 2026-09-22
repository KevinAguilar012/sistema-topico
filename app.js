// ================================================================
// SISTEMA INTEGRAL DEL TÓPICO INSTITUCIONAL - IESTP CARHUAZ
// CONTROLADOR PRINCIPAL (FRONTEND 100% MYSQL VÍA NODE.JS API)
// ================================================================

// ================================================================
// HELPER DE NOTIFICACIONES Y ALERTAS (TOAST FLOTANTE CON SWEETALERT2)
// ================================================================
function mostrarToast(mensaje, icono = 'success') {
    if (typeof Swal !== 'undefined') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
        Toast.fire({
            icon: icono, // 'success', 'error', 'warning', 'info'
            title: mensaje
        });
    } else {
        alert(mensaje);
    }
}

function mostrarAlerta(titulo, mensaje, icono = 'info') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: titulo,
            text: mensaje,
            icon: icono,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2563eb'
        });
    } else {
        alert(`${titulo}\n\n${mensaje}`);
    }
}

// ================================================================
// FUNCIONES UI ESTÉTICAS: MODO OSCURO, RELOJ, CONTRASEÑA, KPIS, CHART
// ================================================================
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
    if (window._ultimoDataMinsaProgramas) {
        renderizarGraficoMinsa(window._ultimoDataMinsaProgramas);
    }
}

function inicializarTema() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const btn = document.getElementById('themeToggleBtn');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}

function iniciarReloj() {
    function update() {
        const clockEl = document.getElementById('clockText');
        if (clockEl) {
            const ahora = new Date();
            clockEl.innerText = ahora.toLocaleTimeString('es-PE');
        }
    }
    update();
    setInterval(update, 1000);
}

function togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    if (btnEl) {
        btnEl.innerHTML = isPass ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    }
}

async function actualizarKpiMetrics() {
    try {
        const atenciones = (typeof API !== 'undefined' && API.atenciones) ? await API.atenciones.listar() : [];
        const botiquin = (typeof API !== 'undefined' && API.botiquin) ? await API.botiquin.listar() : [];
        const derivaciones = (typeof API !== 'undefined' && API.derivaciones) ? await API.derivaciones.listar() : [];
        
        const hoyStr = new Date().toLocaleDateString('es-PE');
        const atencionesHoy = (atenciones || []).filter(a => (a.fecha || '').includes(hoyStr)).length;
        const stockAlerta = (botiquin || []).filter(b => parseInt(b.stock || 0, 10) <= 10).length;
        const pacSet = new Set((atenciones || []).map(a => a.dni).filter(Boolean));
        
        const kpiAt = document.getElementById('kpiAtenciones');
        const kpiAl = document.getElementById('kpiStockAlerta');
        const kpiPac = document.getElementById('kpiPacientes');
        const kpiDer = document.getElementById('kpiDerivaciones');

        if (kpiAt) kpiAt.innerText = atencionesHoy > 0 ? atencionesHoy : (atenciones ? atenciones.length : 0);
        if (kpiAl) kpiAl.innerText = stockAlerta;
        if (kpiPac) kpiPac.innerText = pacSet.size || (atenciones ? atenciones.length : 0);
        if (kpiDer) kpiDer.innerText = Array.isArray(derivaciones) ? derivaciones.length : 0;
    } catch (e) {
        console.warn("KPI metrics notice:", e);
    }
}

let _minsaChartInstance = null;
function renderizarGraficoMinsa(datosProgramas) {
    window._ultimoDataMinsaProgramas = datosProgramas;
    const ctx = document.getElementById('minsaChartCanvas');
    if (!ctx || typeof Chart === 'undefined') return;

    if (_minsaChartInstance) {
        _minsaChartInstance.destroy();
    }

    const labels = datosProgramas.map(p => {
        if (p.programa.includes("Enfermería")) return "Enfermería Técnica";
        if (p.programa.includes("Arquitectura")) return "T.I. / Software";
        return "Docentes / Apoyo";
    });
    const dataIra = datosProgramas.map(p => p.iras);
    const dataEda = datosProgramas.map(p => p.edas);

    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#f8fafc' : '#1e293b';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';

    _minsaChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Casos IRAS',
                    data: dataIra,
                    backgroundColor: '#0d9488',
                    borderRadius: 6
                },
                {
                    label: 'Casos EDAS',
                    data: dataEda,
                    backgroundColor: '#ea580c',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: textColor, font: { family: 'Inter', weight: '600' } }
                }
            },
            scales: {
                x: {
                    ticks: { color: textColor, font: { family: 'Inter', size: 11 } },
                    grid: { color: gridColor }
                },
                y: {
                    ticks: { color: textColor, precision: 0 },
                    grid: { color: gridColor },
                    beginAtZero: true
                }
            }
        }
    });
}

// ================================================================
// 1. ESTADO Y CONFIGURACIÓN DE LA INTERFAZ
// ================================================================
function actualizarEstadoUI(conectado = true) {
    const badge = document.getElementById('dbStatusBadge');
    const loginDot = document.getElementById('loginDbDot');
    const loginText = document.getElementById('loginDbText');

    if (badge) {
        badge.className = 'db-status-badge db-online';
        badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> BD MySQL Conectada (Node.js API)';
        badge.title = 'Conexión activa con MySQL (http://localhost:3000/api)';
    }
    if (loginDot) loginDot.innerText = '🟢';
    if (loginText) {
        loginText.innerText = 'Conectada a MySQL (http://localhost:3000/api)';
        loginText.style.color = '#276749';
    }
}

// ================================================================
// 2. INICIALIZACIÓN DEL SISTEMA
// ================================================================
document.addEventListener('DOMContentLoaded', async () => {

    inicializarTema();
    iniciarReloj();

    if (typeof inicializarUbigeo === 'function') {
        inicializarUbigeo();
    }
    
    inicializarSelectsFechaNacF1();

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

    // Establecer estado visual de la base de datos
    actualizarEstadoUI(true);

    // Cargar métricas iniciales
    await actualizarKpiMetrics();

    // Restaurar sesión de la licenciada si existe
    const sesionGuardada = sessionStorage.getItem('usuarioSesion');
    if (sesionGuardada) {
        try {
            const usrSesion = JSON.parse(sesionGuardada);
            const nombreLic = usrSesion.displayName || (usrSesion.nombre ? (usrSesion.nombre.toLowerCase().startsWith('lic.') ? usrSesion.nombre : `Lic. ${usrSesion.nombre}`) : `Lic. ${usrSesion.usuario}`);
            const userLabel = document.getElementById('userDisplayName');
            if (userLabel) userLabel.innerText = nombreLic;

            document.getElementById('loginView')?.classList.add('hidden');
            document.getElementById('dashboardView')?.classList.remove('hidden');

            await renderizarTablaBotiquin();
            await renderizarTablaUsuarios();
            await actualizarReportesF6();
            await renderizarTablaF3();
        } catch (e) {
            console.error("Error al restaurar sesión:", e);
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

            try {
                const res = await API.usuarios.login(u, p);
                if (res && !res.error && res.usuario) {
                    const rawNombre = res.usuario.nombre ? res.usuario.nombre.trim() : u;
                    const nombreFormateado = rawNombre.toLowerCase().startsWith('lic.') ? rawNombre : `Lic. ${rawNombre}`;

                    document.getElementById('loginView').classList.add('hidden');
                    document.getElementById('dashboardView').classList.remove('hidden');
                    document.getElementById('userDisplayName').innerText = nombreFormateado;

                    sessionStorage.setItem('usuarioSesion', JSON.stringify({
                        ...res.usuario,
                        displayName: nombreFormateado
                    }));

                    await renderizarTablaBotiquin();
                    await renderizarTablaUsuarios();
                    await actualizarReportesF6();
                    await renderizarTablaF3();
                    await actualizarKpiMetrics();
                    if (errorMsg) errorMsg.classList.add('hidden');
                } else {
                    if (errorMsg) {
                        errorMsg.innerText = (res && res.mensaje) || "Usuario o contraseña incorrectos.";
                        errorMsg.classList.remove('hidden');
                    }
                }
            } catch (err) {
                console.error("Error en login:", err);
                if (errorMsg) {
                    errorMsg.innerText = "Error al conectar con la API.";
                    errorMsg.classList.remove('hidden');
                }
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
            sessionStorage.removeItem('usuarioSesion');
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

            // Verificar en MySQL vía API si el paciente ya está registrado
            const existente = await API.pacientes.buscarPorDni(dni);
            if (existente) {
                mostrarToast(`El paciente con DNI ${dni} ya cuenta con una Historia Clínica activa.`, 'warning');
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

            const res = await API.pacientes.registrar(paciente);
            if (res && res.error) {
                mostrarToast(`No se pudo registrar el paciente: ${res.mensaje}`, 'error');
                return;
            }

            mostrarToast(`Historia Clínica ${paciente.historiaClinica} registrada para ${paciente.nombres} ${paciente.apePaterno}`, 'success');
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
                mostrarToast("Primero ingrese y busque los datos del paciente por su DNI.", "warning");
                return;
            }

            const diagPrincipal = document.getElementById('f2DiagnosticoMain').value;
            if (!diagPrincipal) {
                mostrarToast("Seleccione el Tipo de Diagnóstico / Evaluación.", "warning");
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

            const res = await API.atenciones.registrar(atencion);
            if (res && res.error) {
                mostrarToast(`Error al guardar la atención: ${res.mensaje}`, 'error');
                return;
            }

            // Descontar medicamento vía API MySQL
            await descontarStockBotiquin(diagPrincipal);

            mostrarToast('Atención registrada con éxito', 'success');

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
            await renderizarTablaF3();
            await actualizarReportesF6();
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

            const res = await API.botiquin.agregarOActualizar({
                codigo, nombre, categoria, cantidad, vencimiento
            });

            if (res && res.error) {
                mostrarToast(`Error al actualizar botiquín: ${res.mensaje}`, 'error');
                return;
            }

            mostrarToast(`Insumo / Medicamento "${nombre}" registrado con éxito.`, 'success');
            formF4.reset();
            await renderizarTablaBotiquin();
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
            const pacBD = await API.pacientes.buscarPorDni(dni);
            const nom = pacBD ? `${pacBD.ape_paterno || pacBD.apePaterno || ''} ${pacBD.nombres || ''}`.trim() : `DNI ${dni}`;
            const destino = document.getElementById('f5Establecimiento').value;
            const motivo = document.getElementById('f5Motivo').value;
            const acomp = document.getElementById('f5Acompanante')?.value || '';

            const res = await API.derivaciones.registrar({
                dni,
                paciente: nom,
                establecimiento: destino,
                motivo: motivo,
                acompanante: acomp,
                personal: document.getElementById('userDisplayName')?.innerText || 'Lic. Enfermería'
            });

            if (res && res.error) {
                mostrarToast(`Error al guardar derivación: ${res.mensaje}`, 'error');
                return;
            }

            mostrarAlerta("🚑 Ficha de Referencia Generada", `Paciente: ${nom}\nDestino: ${destino}\nMotivo: ${motivo}`, "success");
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

            const res = await API.usuarios.registrar(usr);
            if (res && res.error) {
                mostrarToast(`No se pudo registrar el usuario: ${res.mensaje}`, 'error');
                return;
            }

            mostrarToast(`Personal ${usr.nombre} (${usr.usuario}) registrado con éxito.`, 'success');
            formF7.reset();
            await renderizarTablaUsuarios();
        });
    }
});

// ================================================================
// 3. NAVEGACIÓN ENTRE MÓDULOS
// ================================================================
async function mostrarSeccion(idSec) {
    const secciones = ['secF1', 'secF2', 'secF3', 'secF4', 'secF5', 'secF6', 'secF7'];
    secciones.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.classList.add('hidden');
    });

    document.querySelectorAll('.sidebar li').forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('onclick') && li.getAttribute('onclick').includes(idSec)) {
            li.classList.add('active');
        }
    });

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

    await actualizarKpiMetrics();

    if (idSec === 'f3_historial') await renderizarTablaF3();
    if (idSec === 'f4_botiquin') await renderizarTablaBotiquin();
    if (idSec === 'f6_reportes') await actualizarReportesF6();
    if (idSec === 'f7_usuarios') await renderizarTablaUsuarios();
}

// ================================================================
// 4. BÚSQUEDA DE PACIENTE (FORMULARIO 2) - VÍA API REST MYSQL
// ================================================================
async function buscarPacienteF2() {
    const dni = document.getElementById('f2BuscarDni').value.trim();
    if (!dni) {
        mostrarToast("Por favor ingrese un número de DNI para la búsqueda.", "warning");
        return;
    }

    let paciente = null;

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

    const infoCard = document.getElementById('pacienteEncontradoInfo');

    if (paciente) {
        const edadFormateada = paciente.edad ? `${paciente.edad} años` : '';

        // Formulario 2 (Atención Principal)
        if (document.getElementById('f2Dni')) document.getElementById('f2Dni').value = paciente.dni;
        if (document.getElementById('f2NombreCompleto')) document.getElementById('f2NombreCompleto').value = paciente.nombreCompleto;
        if (document.getElementById('f2Programa')) document.getElementById('f2Programa').value = paciente.programa;

        // Ficha de Atención IRA
        if (document.getElementById('iraDni')) document.getElementById('iraDni').value = paciente.dni;
        if (document.getElementById('iraNombreCompleto')) document.getElementById('iraNombreCompleto').value = paciente.nombreCompleto;
        if (document.getElementById('iraEdad')) document.getElementById('iraEdad').value = edadFormateada;
        if (document.getElementById('iraGenero')) document.getElementById('iraGenero').value = paciente.genero || '';
        if (document.getElementById('iraDireccion')) document.getElementById('iraDireccion').value = paciente.domicilio;

        // Ficha de Atención EDA
        if (document.getElementById('edaDni')) document.getElementById('edaDni').value = paciente.dni;
        if (document.getElementById('edaNombreCompleto')) document.getElementById('edaNombreCompleto').value = paciente.nombreCompleto;
        if (document.getElementById('edaEdad')) document.getElementById('edaEdad').value = edadFormateada;
        if (document.getElementById('edaGenero')) document.getElementById('edaGenero').value = paciente.genero || '';
        if (document.getElementById('edaDireccion')) document.getElementById('edaDireccion').value = paciente.domicilio;
        if (document.getElementById('edaAcompanante')) document.getElementById('edaAcompanante').value = paciente.apoderado;

        if (infoCard) infoCard.classList.remove('hidden');
        mostrarToast(`Paciente cargado: ${paciente.nombreCompleto}`, 'success');
    } else {
        mostrarAlerta("Paciente No Encontrado", `No se encontró ningún paciente con el DNI ${dni}.\nPor favor regístrelo previamente en el módulo 'Nuevo Paciente'.`, "warning");
        limpiarCamposPacienteF2();
    }
}

function limpiarCamposPacienteF2() {
    if (document.getElementById('f2Dni')) document.getElementById('f2Dni').value = "";
    if (document.getElementById('f2NombreCompleto')) document.getElementById('f2NombreCompleto').value = "";
    if (document.getElementById('f2Programa')) document.getElementById('f2Programa').value = "";

    // IRA
    if (document.getElementById('iraDni')) document.getElementById('iraDni').value = "";
    if (document.getElementById('iraNombreCompleto')) document.getElementById('iraNombreCompleto').value = "";
    if (document.getElementById('iraEdad')) document.getElementById('iraEdad').value = "";
    if (document.getElementById('iraGenero')) document.getElementById('iraGenero').value = "";
    if (document.getElementById('iraDireccion')) document.getElementById('iraDireccion').value = "";

    // EDA
    if (document.getElementById('edaDni')) document.getElementById('edaDni').value = "";
    if (document.getElementById('edaNombreCompleto')) document.getElementById('edaNombreCompleto').value = "";
    if (document.getElementById('edaEdad')) document.getElementById('edaEdad').value = "";
    if (document.getElementById('edaGenero')) document.getElementById('edaGenero').value = "";
    if (document.getElementById('edaDireccion')) document.getElementById('edaDireccion').value = "";
    if (document.getElementById('edaAcompanante')) document.getElementById('edaAcompanante').value = "";

    const infoCard = document.getElementById('pacienteEncontradoInfo');
    if (infoCard) infoCard.classList.add('hidden');
}

// ================================================================
// 5. GESTIÓN DINÁMICA DE FICHAS (IRA / EDA)
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
// 6. MODAL DE RECETA E IMPRESIÓN
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
        <div style="border-bottom: 1px dashed var(--border-color); padding-bottom: 8px; margin-bottom: 8px;">
            <p><strong>Fecha:</strong> ${atencion.fecha}</p>
            <p><strong>Paciente:</strong> ${atencion.paciente} | <strong>DNI:</strong> ${atencion.dni}</p>
            <p><strong>Área / Programa:</strong> ${atencion.programa}</p>
            <p><strong>Diagnóstico:</strong> ${atencion.diagnostico} (${atencion.subtipo})</p>
        </div>
        <h4 style="color: var(--primary); margin-bottom: 5px;">Prescripción y Recomendaciones:</h4>
        ${esquema}
        <p style="margin-top: 10px;"><strong>Tratamiento Administrado en Tópico:</strong> ${atencion.tratamiento || 'Ninguno adicional'}</p>
        <p style="margin-top: 10px; font-size: 11px; color: var(--text-muted); text-align: right;">Atendido por: ${atencion.licenciada}</p>
    `;

    document.getElementById('modalReceta').classList.remove('hidden');
}

function cerrarModalReceta() {
    const modal = document.getElementById('modalReceta');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function imprimirModal() {
    window.print();
    cerrarModalReceta();
}

function cerrarModal() {
    cerrarModalReceta();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cerrarModalReceta();
    }
});


// ================================================================
// 7. TABLA HISTORIAL (FORMULARIO 3)
// ================================================================
async function renderizarTablaF3(datos = null) {
    const tbody = document.getElementById('f3TablaBody');
    if (!tbody) return;
    tbody.innerHTML = "";

    const lista = datos !== null ? datos : await API.atenciones.listar();

    if (!lista || lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 15px;">No hay registros de atenciones médicas.</td></tr>`;
        return;
    }

    // El servidor ya devuelve la lista en orden descendente (más recientes primero)
    window._ultimasAtencionesF3 = lista;

    lista.forEach((item, index) => {
        const tr = document.createElement('tr');
        const esOtros = (item.programa || '').includes('Otros') || (item.programa || '').includes('Docentes');
        const tipoBadge = esOtros 
            ? `<span class="badge badge-warning" style="font-weight: 600;"><i class="fa-solid fa-user-tie"></i> Docente / Administrativo</span>`
            : `<span class="badge badge-info" style="font-weight: 600;"><i class="fa-solid fa-user-graduate"></i> Estudiante</span>`;

        tr.innerHTML = `
            <td>${item.fecha || ''}</td>
            <td><strong>${item.dni || ''}</strong></td>
            <td>${item.paciente || ''}</td>
            <td>${item.programa || ''}</td>
            <td><span class="badge badge-info">${item.diagnostico || ''}</span></td>
            <td><span style="font-weight: 500;">${item.subtipo || '-'}</span></td>
            <td>${tipoBadge}</td>
            <td><span style="color: var(--primary); font-weight: 600;">${item.licenciada || 'Lic. de Guardia'}</span></td>
            <td>
                <button type="button" class="btn-primary" style="padding: 3px 8px; font-size: 11px; width: auto;" onclick="abrirModalRecetaDesdeHistorial(${index})">👁️ Ver Receta</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalRecetaDesdeHistorial(index) {
    if (window._ultimasAtencionesF3 && window._ultimasAtencionesF3[index]) {
        mostrarModalReceta(window._ultimasAtencionesF3[index]);
    }
}

async function filtrarTablaF3() {
    const texto = (document.getElementById('f3FiltroDni')?.value || '').trim();
    const diagFiltro = document.getElementById('f3FiltroDiag')?.value || 'TODOS';

    const filtrados = await API.atenciones.listar(texto, diagFiltro);
    await renderizarTablaF3(filtrados);
}

// ================================================================
// 8. TABLA BOTIQUÍN (FORMULARIO 4)
// ================================================================
async function renderizarTablaBotiquin() {
    const tbody = document.getElementById('f4TablaBody');
    if (!tbody) return;
    tbody.innerHTML = "";

    const listaBotiquin = await API.botiquin.listar();

    if (!listaBotiquin || listaBotiquin.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 15px; color: var(--text-muted);">Botiquín vacío.</td></tr>`;
        return;
    }

    listaBotiquin.forEach(item => {
        const tr = document.createElement('tr');
        const stock = parseInt(item.stock || 0, 10);
        const bajoStock = stock <= 10;
        const estado = bajoStock 
            ? `<span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> Bajo Stock</span>`
            : `<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> Disponible</span>`;

        tr.innerHTML = `
            <td>${item.fecha || ''}</td>
            <td><strong>${item.dni || ''}</strong></td>
            <td>${item.paciente || ''}</td>
            <td>${item.programa || ''}</td>
            <td><span class="badge badge-info">${item.diagnostico || ''}</span></td>
            <td><span style="font-weight: 500;">${item.subtipo || '-'}</span></td>
            <td><span class="badge badge-warning" style="font-weight: 600;">${item.programa || 'General'}</span></td>
            <td><span style="color: var(--primary); font-weight: 600;">${item.licenciada || 'Lic. de Guardia'}</span></td>
            <td>
                <button type="button" class="btn-primary" style="padding: 3px 8px; font-size: 11px; width: auto;" onclick="abrirModalRecetaDesdeHistorial(${index})">👁️ Ver Receta</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function descontarStockBotiquin(diag) {
    const codigo = diag === 'IRA' ? 'MED-001' : 'MED-002';
    await API.botiquin.descontar(codigo, 1);
    await renderizarTablaBotiquin();
    await actualizarKpiMetrics();
}

// ================================================================
// 9. USUARIOS (FORMULARIO 7)
// ================================================================
async function renderizarTablaUsuarios() {
    const tbody = document.getElementById('f7TablaBody');
    if (!tbody) return;
    tbody.innerHTML = "";

    const listaUsuarios = await API.usuarios.listar();

    if (!listaUsuarios || listaUsuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 15px; color: var(--text-muted);">No hay usuarios registrados.</td></tr>`;
        return;
    }

    listaUsuarios.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.fecha || ''}</td>
            <td><strong>${item.dni || ''}</strong></td>
            <td>${item.paciente || ''}</td>
            <td>${item.programa || ''}</td>
            <td><span class="badge badge-info">${item.diagnostico || ''}</span></td>
            <td><span style="font-weight: 500;">${item.subtipo || '-'}</span></td>
            <td><span class="badge badge-warning" style="font-weight: 600;">${item.programa || 'General'}</span></td>
            <td><span style="color: var(--primary); font-weight: 600;">${item.licenciada || 'Lic. de Guardia'}</span></td>
            <td>
                <button type="button" class="btn-primary" style="padding: 3px 8px; font-size: 11px; width: auto;" onclick="abrirModalRecetaDesdeHistorial(${index})">👁️ Ver Receta</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ================================================================
// 10. REPORTES Y VIGILANCIA MINSA (FORMULARIO 6)
// ================================================================
async function actualizarReportesF6() {
    const atenciones = await API.atenciones.listar();

    const iras = atenciones.filter(x => x.diagnostico === 'IRA').length;
    const edas = atenciones.filter(x => x.diagnostico === 'EDA').length;

    const cntIra = document.getElementById('f6CntIra');
    const cntEda = document.getElementById('f6CntEda');
    const cntTotal = document.getElementById('f6CntTotal');

    if (cntIra) cntIra.innerText = iras;
    if (cntEda) cntEda.innerText = edas;
    if (cntTotal) cntTotal.innerText = atenciones.length;

    const programas = [
        "Enfermería Técnica",
        "Arquitectura de Plataformas y Servicios de Tecnologías de la Información",
        "Otros (Docentes, Administrativos y Externos)"
    ];

    const datosProgramas = [];
    const tbody = document.getElementById('f6TablaProgramas');
    if (tbody) tbody.innerHTML = "";

    programas.forEach(prog => {
        const cIra = atenciones.filter(x => x.programa === prog && x.diagnostico === 'IRA').length;
        const cEda = atenciones.filter(x => x.programa === prog && x.diagnostico === 'EDA').length;

        datosProgramas.push({
            programa: prog,
            iras: cIra,
            edas: cEda
        });

        if (tbody) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${item.fecha || ''}</td>
            <td><strong>${item.dni || ''}</strong></td>
            <td>${item.paciente || ''}</td>
            <td>${item.programa || ''}</td>
            <td><span class="badge badge-info">${item.diagnostico || ''}</span></td>
            <td><span style="font-weight: 500;">${item.subtipo || '-'}</span></td>
            <td><span class="badge badge-warning" style="font-weight: 600;">${item.programa || 'General'}</span></td>
            <td><span style="color: var(--primary); font-weight: 600;">${item.licenciada || 'Lic. de Guardia'}</span></td>
            <td>
                <button type="button" class="btn-primary" style="padding: 3px 8px; font-size: 11px; width: auto;" onclick="abrirModalRecetaDesdeHistorial(${index})">👁️ Ver Receta</button>
            </td>
        `;
            tbody.appendChild(tr);
        }
    });

    renderizarGraficoMinsa(datosProgramas);
}

// ================================================================
// 11. UTILIDADES DE FORMULARIO
// ================================================================
function inicializarSelectsFechaNacF1() {
    const selectDia = document.getElementById('f1FechaNacDia');
    const selectAnio = document.getElementById('f1FechaNacAnio');
    
    if (selectDia) {
        let htmlDias = '<option value="">Día</option>';
        for (let d = 1; d <= 31; d++) {
            const val = String(d).padStart(2, '0');
            htmlDias += `<option value="${val}">${d}</option>`;
        }
        selectDia.innerHTML = htmlDias;
    }

    if (selectAnio) {
        let htmlAnios = '<option value="">Año</option>';
        const anioActual = new Date().getFullYear();
        for (let a = anioActual; a >= 1910; a--) {
            htmlAnios += `<option value="${a}">${a}</option>`;
        }
        selectAnio.innerHTML = htmlAnios;
    }

    const formF1 = document.getElementById('formF1');
    if (formF1) {
        formF1.addEventListener('reset', () => {
            setTimeout(() => {
                actualizarFechaNacF1();
            }, 0);
        });
    }
}

function actualizarFechaNacF1() {
    const diaEl = document.getElementById('f1FechaNacDia');
    const mesEl = document.getElementById('f1FechaNacMes');
    const anioEl = document.getElementById('f1FechaNacAnio');
    const hiddenEl = document.getElementById('f1FechaNac');

    if (!diaEl || !mesEl || !anioEl || !hiddenEl) return;

    const dia = diaEl.value;
    const mes = mesEl.value;
    const anio = anioEl.value;

    // Ajustar número de días si hay un mes seleccionado
    if (mes) {
        const dMax = new Date(anio ? parseInt(anio, 10) : 2000, parseInt(mes, 10), 0).getDate();
        const diaActual = diaEl.value;
        let htmlDias = '<option value="">Día</option>';
        for (let d = 1; d <= dMax; d++) {
            const val = String(d).padStart(2, '0');
            const selected = val === diaActual ? 'selected' : '';
            htmlDias += `<option value="${val}" ${selected}>${d}</option>`;
        }
        diaEl.innerHTML = htmlDias;
    }

    if (dia && mes && anio) {
        const fechaIso = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        hiddenEl.value = fechaIso;
        calcularEdadF1(fechaIso);
    } else {
        hiddenEl.value = '';
        const inputEdad = document.getElementById('f1Edad');
        if (inputEdad) inputEdad.value = '';
    }
}
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
// 12. AUTOMATIZACIÓN Y REGLAS LÓGICAS PARA EDA
// ================================================================
function evaluarReglasEDA() {
    const estadoHidratacion = document.getElementById('edaEstadoHidratacion')?.value;
    const tipoDiarrea = document.getElementById('edaTipoDiarrea')?.value;

    const manejoFluidos = document.getElementById('edaManejoFluidos');
    const tratFarmacologico = document.getElementById('edaTratFarmacologico');
        const secConsejeria = document.getElementById('secEdaConsejeria');

    if (estadoHidratacion === 'Sin deshidratación clínica') {
        if (manejoFluidos) manejoFluidos.value = 'Plan A - Hidratación vía oral (Ambulatorio)';
    } 
    else if (estadoHidratacion === 'Deshidratación moderada') {
        if (manejoFluidos) manejoFluidos.value = 'Plan B - Hidratación vía oral supervisada (SRO en centro de salud)';
    } 
    else if (estadoHidratacion === 'Deshidratación grave / Shock hipovolémico') {
        if (manejoFluidos) manejoFluidos.value = 'Plan C - Hidratación intravenosa (Emergencia/Observación)';
        mostrarAlerta("🚨 ¡ALERTA CRÍTICA: DESHIDRATACIÓN GRAVE!", "Inicie de inmediato Hidratación Intravenosa de Emergencia (Plan C) y ordene transferencia / evaluación urgente.", "error");
    }

    if (manejoFluidos && manejoFluidos.value.includes('Plan A')) {
        if (secConsejeria) {
            secConsejeria.classList.add('consejeria-active');
        }
        ['edaPrevManos', 'edaPrevAgua', 'edaPrevAlimentos', 'edaAlarmaPersistencia', 'edaAlarmaSangrado'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.checked = true;
        });
    } else {
        if (secConsejeria) {
            secConsejeria.classList.remove('consejeria-active');
        }
    }

    if (tipoDiarrea === 'Síndrome disentérico') {
                if (tratFarmacologico && tratFarmacologico.value === 'Ninguno') {
            tratFarmacologico.value = 'Antibioticoterapia empírica';
        }
    } else {
            }
}

function generarHistoriaF1(dni) {
    const numHist = document.getElementById('f1NumHistoria');
    if (numHist) {
        numHist.value = dni.length > 0 ? `HC-${dni}` : '';
    }
}