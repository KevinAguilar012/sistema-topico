# 📘 Guía de Conexión de Base de Datos - Sistema de Tópico Institucional
**IESTP CARHUAZ - Tópico de Salud**

Esta guía te explica cómo conectar la base de datos **MySQL** (mediante **XAMPP**) a tu sistema. Ya hemos dejado toda la estructura creada y configurada.

---

## 📁 1. Estructura de Archivos Creada

Hemos organizado el proyecto para que cuente con una arquitectura profesional cliente-servidor (Frontend + API Backend en PHP + Base de Datos Relacional):

```text
SISTEMA-TOPICO/
├── api/                           <-- API Backend en PHP (Endpoints REST)
│   ├── config/
│   │   ├── conexion.php           <-- Conexión PDO a MySQL (configurable)
│   │   └── cors.php               <-- Cabeceras CORS y utilidades JSON
│   ├── atenciones.php             <-- Guardar y listar atenciones médicas
│   ├── botiquin.php               <-- Gestión de medicamentos y control de stock
│   ├── derivaciones.php           <-- Registro de referencias / derivaciones
│   ├── pacientes.php              <-- Registro y búsqueda por DNI con apoderado
│   ├── reportes.php               <-- Estadísticas y vigilancia MINSA (IRAS/EDAS)
│   ├── test_conexion.php          <-- Verificador de estado de la base de datos
│   └── usuarios.php               <-- Autenticación (login) y registro de personal
│
├── database/                      <-- Base de Datos
│   └── schema.sql                 <-- Script SQL listo para importar en phpMyAdmin
│
├── api-client.js                  <-- Conector en JavaScript que comunica el Frontend con la API
├── app.js                         <-- Lógica actualizada con soporte híbrido (MySQL + LocalStorage)
├── index.html                     <-- Vistas con indicador visual de estado de BD
├── styles.css                     <-- Estilos e indicador visual de conexión
└── ubigeo.js                      <-- Catálogo de departamentos, provincias y distritos
```

> ⚡ **Enlace directo ya configurado:** Ya creamos un enlace directo (`junction`) hacia tu carpeta `C:\xampp\htdocs\SISTEMA-TOPICO`, por lo que cada cambio que hagas en tu Escritorio se refleja de inmediato en tu servidor web local de XAMPP sin necesidad de copiar archivos manualmente.

---

## 🚀 2. Paso a Paso para Conectar la Base de Datos

Sigue estos 5 pasos sencillos para tener tu base de datos funcionando:

### Paso 1: Abrir XAMPP Control Panel
1. En tu computadora, busca y abre el programa **XAMPP Control Panel**.
2. Haz clic en el botón **Start** al lado de **Apache**.
3. Haz clic en el botón **Start** al lado de **MySQL**.
   *(Ambos deben ponerse en color verde).*

---

### Paso 2: Abrir phpMyAdmin
1. Abre tu navegador web favorito (Google Chrome, Edge, Firefox).
2. Ingresa a la siguiente dirección:
   👉 [http://localhost/phpmyadmin](http://localhost/phpmyadmin)

---

### Paso 3: Importar el Script SQL
1. En la parte superior de phpMyAdmin, haz clic en la pestaña **Importar** (o *Import*).
2. Haz clic en el botón **Seleccionar archivo** (o *Choose File*).
3. Busca y selecciona el archivo del proyecto:
   `C:\Users\JHON IBARRA\Desktop\SISTEMA-TOPICO\database\schema.sql`
4. Desplázate hacia el final de la página y haz clic en el botón **Importar** (o *Continuar* / *Go*).

✅ **¡Listo!** El script creará automáticamente:
- La base de datos `sistema_topico`.
- Las 5 tablas: `usuarios`, `pacientes`, `medicamentos`, `atenciones` y `derivaciones`.
- Índices de alto rendimiento y relaciones relacionales.
- Datos de prueba iniciales (Usuario Administrador, Medicamentos con stock y Paciente demo).

---

### Paso 4: Probar la Conexión en el Navegador
Para comprobar que el backend se conecta sin problemas a MySQL, abre en tu navegador:
👉 [http://localhost/SISTEMA-TOPICO/api/test_conexion.php](http://localhost/SISTEMA-TOPICO/api/test_conexion.php)

Deberás ver una respuesta como esta:
```json
{
    "status": "ok",
    "conectado": true,
    "mensaje": "Conexión a la base de datos 'sistema_topico' establecida con éxito."
}
```

---

### Paso 5: Abrir el Sistema
Abre el sistema desde tu servidor local:
👉 [http://localhost/SISTEMA-TOPICO/](http://localhost/SISTEMA-TOPICO/)

Notarás dos cosas:
1. En la pantalla de login verás: `🟢 Base de Datos: Conectada a MySQL (sistema_topico)`.
2. En la barra superior del menú verás la insignia: `🟢 BD MySQL Conectada`.

---

## 🔑 3. Credenciales de Acceso por Defecto

El script incluye un usuario inicial configurado:
- **Usuario:** `admin`
- **Contraseña:** `1234`
- **Nombre:** Lic. Enfermería Tópico
- **Turno:** Mañana

*(También puedes registrar nuevo personal de enfermería directamente desde el módulo **Gest. Usuarios** en el formulario F7).*

---

## ⚙️ 4. ¿Cómo Modificar la Configuración de la BD? (Opcional)

Si en el futuro cambias el usuario o la contraseña de tu MySQL en XAMPP, solo debes editar el archivo:
📄 `api/config/conexion.php`

```php
// Parámetros de conexión
private static $host = "localhost";
private static $port = "3306";          // Puerto de MySQL (por defecto 3306)
private static $db   = "sistema_topico"; // Nombre de la base de datos
private static $user = "root";           // Usuario de MySQL
private static $pass = "";               // Contraseña (en XAMPP por defecto va vacía)
```

---

## 🛡️ 5. Modo Híbrido (Tolerancia a Fallos / Offline)

Tu sistema ahora cuenta con **arquitectura tolerante a fallos**:
- **Si MySQL está encendido:** Todas las operaciones (crear paciente, registrar triaje, actualizar botiquín, login, reportes) se guardan y consultan directamente en MySQL.
- **Si MySQL está apagado:** El sistema no se congela ni da error; automáticamente entra en `🟡 Modo Local (Sin BD)` guardando los registros en el almacenamiento local del navegador (`LocalStorage`) hasta que enciendas XAMPP.
