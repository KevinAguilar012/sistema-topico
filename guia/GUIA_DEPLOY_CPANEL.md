# 🚀 Guía de Despliegue — Sistema de Tópico IESTP Carhuaz

## Despliegue en cPanel con Subdominio + Git Version Control + Node.js

---

## 📋 Resumen del Proyecto

| Componente | Tecnología |
|---|---|
| **Backend** | Node.js + Express 5 |
| **Base de Datos** | MySQL (mysql2) |
| **Frontend** | HTML/CSS/JS estático (servido por Express) |
| **Dependencias** | `express`, `cors`, `dotenv`, `mysql2` |
| **Puerto** | `process.env.PORT` ó `3000` |

> **⚠️ REQUISITO:** Tu hosting con cPanel **debe soportar Node.js**. Verifica que tu plan tenga la opción **"Setup Node.js App"** en cPanel.

---

## 📑 Índice

1. [Preparar el Repositorio en GitHub](#1-preparar-el-repositorio-en-github)
2. [Crear el Subdominio en cPanel](#2-crear-el-subdominio-en-cpanel)
3. [Crear la Base de Datos MySQL en cPanel](#3-crear-la-base-de-datos-mysql-en-cpanel)
4. [Conectar GitHub con Git Version Control de cPanel](#4-conectar-github-con-git-version-control-de-cpanel)
5. [Configurar la Aplicación Node.js en cPanel](#5-configurar-la-aplicación-nodejs-en-cpanel)
6. [Configurar Variables de Entorno (.env)](#6-configurar-variables-de-entorno-env)
7. [Desplegar y Verificar](#7-desplegar-y-verificar)
8. [Actualizaciones Futuras (CI/CD)](#8-actualizaciones-futuras-cicd)
9. [Solución de Problemas Comunes](#9-solución-de-problemas-comunes)
10. [Checklist Final](#10-checklist-final)

---

## 1. Preparar el Repositorio en GitHub

### 1.1 Crear el repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `sistema-topico`
3. Visibilidad: **Private** (recomendado por seguridad)
4. **NO** inicialices con README (ya tienes archivos localmente)

### 1.2 Subir el proyecto a GitHub

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar repositorio (si aún no lo hiciste)
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "feat: versión inicial del Sistema de Tópico IESTP Carhuaz"

# Conectar con el repositorio remoto de GitHub
git remote add origin https://github.com/TU_USUARIO/sistema-topico.git

# Subir al branch principal
git branch -M main
git push -u origin main
```

> **🔒 IMPORTANTE:** El archivo `.env` ya está en `.gitignore` y NO se subirá a GitHub. Las credenciales se configuran directamente en el servidor.

---

## 2. Crear el Subdominio en cPanel

### 2.1 Acceder a cPanel

Ingresa a tu cPanel:
- URL: `https://tudominio.com:2083` o `https://tudominio.com/cpanel`
- Inicia sesión con tus credenciales del hosting

### 2.2 Crear el subdominio

1. Busca **"Dominios"** o **"Subdominios"** en cPanel
   - cPanel moderno: **Dominios** → **Crear un nuevo dominio**
   - cPanel clásico: **Subdominios**

2. Configura:

| Campo | Valor |
|---|---|
| **Subdominio** | `topico` |
| **Dominio raíz** | `tudominio.com` |
| **Raíz del documento** | `/home/TU_USUARIO_CPANEL/topico.tudominio.com` |

3. Clic en **"Crear"**

> **📝 RESULTADO:** Tu subdominio será `topico.tudominio.com`  
> La propagación DNS puede tardar entre 5 minutos y 24 horas.

### 2.3 Configurar SSL (HTTPS)

1. En cPanel, ve a **"SSL/TLS"** o **"Let's Encrypt™ SSL"**
2. Genera un certificado SSL gratuito para `topico.tudominio.com`
3. Esto es necesario para que tu sitio funcione con `https://`

---

## 3. Crear la Base de Datos MySQL en cPanel

### 3.1 Crear la base de datos

1. En cPanel → **"Bases de datos MySQL"** (MySQL® Databases)
2. Sección **"Crear una nueva base de datos"**:
   - Nombre: `sistema_topico`
   - El nombre real será: `TU_USUARIO_CPANEL_sistema_topico`
   - Clic en **"Crear base de datos"**

### 3.2 Crear un usuario para la BD

1. En la misma página, sección **"Usuarios MySQL"**:
   - Usuario: `topico_user`
   - El nombre real será: `TU_USUARIO_CPANEL_topico_user`
   - Contraseña: Usa el **generador de contraseñas** de cPanel
   - **Guarda esta contraseña**, la necesitarás después
   - Clic en **"Crear usuario"**

2. **Asignar el usuario a la base de datos**:
   - Selecciona el usuario recién creado
   - Selecciona la base de datos recién creada
   - Marca **"TODOS LOS PRIVILEGIOS"**
   - Clic en **"Hacer cambios"**

### 3.3 Importar el esquema SQL

1. En cPanel → **phpMyAdmin**
2. En el panel izquierdo, selecciona la base de datos `TU_USUARIO_CPANEL_sistema_topico`
3. Ve a la pestaña **"Importar"**
4. Clic en **"Seleccionar archivo"** → elige `database/bd_fin.sql` de tu proyecto
5. Clic en **"Continuar"**
6. Verifica que las tablas se crearon correctamente

> **💡 ALTERNATIVA:** Si el archivo SQL es muy grande, usa la Terminal de cPanel:
> ```bash
> mysql -u TU_USUARIO_CPANEL_topico_user -p TU_USUARIO_CPANEL_sistema_topico < /home/TU_USUARIO_CPANEL/topico.tudominio.com/database/bd_fin.sql
> ```

---

## 4. Conectar GitHub con Git Version Control de cPanel

### 4.1 Generar clave SSH en cPanel

> **Necesario** si tu repositorio es privado (recomendado).

1. En cPanel → **"Terminal"**
2. Ejecuta:

```bash
ssh-keygen -t ed25519 -C "tu_email@ejemplo.com"
```

3. Presiona **Enter** 3 veces (ubicación por defecto, sin passphrase)
4. Copia la clave pública:

```bash
cat ~/.ssh/id_ed25519.pub
```

5. Copia todo el texto que aparece (empieza con `ssh-ed25519...`)

### 4.2 Agregar la clave SSH en GitHub

1. Ve a **GitHub** → Tu repositorio `sistema-topico`
2. **Settings** → **Deploy keys** → **Add deploy key**
3. Configura:

| Campo | Valor |
|---|---|
| **Title** | `cPanel Server` |
| **Key** | La clave pública que copiaste |
| **Allow write access** | ✅ Marcado |

4. Clic en **"Add key"**

### 4.3 Verificar conexión SSH

En la Terminal de cPanel:

```bash
ssh -T git@github.com
```

Debe aparecer: `Hi TU_USUARIO! You've successfully authenticated`

### 4.4 Clonar el repositorio con Git Version Control

1. En cPanel → **"Git™ Version Control"**
2. Clic en **"Crear"** (Create)
3. Configura:

| Campo | Valor |
|---|---|
| **Clonar un repositorio** | ✅ Activado |
| **URL del repositorio** | `git@github.com:TU_USUARIO/sistema-topico.git` |
| **Ruta del repositorio** | `/home/TU_USUARIO_CPANEL/topico.tudominio.com` |
| **Nombre del repositorio** | `sistema-topico` |

4. Clic en **"Crear"**

> **⚠️ Si da error** porque la carpeta ya existe:
> 1. Ve a **File Manager** en cPanel
> 2. Elimina el contenido de `topico.tudominio.com/`
> 3. Vuelve a intentar

### 4.5 Verificar

En **Git Version Control** debe aparecer tu repositorio listado. Clic en **"Manage"** para ver los commits.

---

## 5. Configurar la Aplicación Node.js en cPanel

### 5.1 Crear la aplicación Node.js

1. En cPanel → **"Setup Node.js App"**
2. Clic en **"CREATE APPLICATION"**
3. Configura:

| Campo | Valor |
|---|---|
| **Node.js version** | `18.x` o `20.x` (la más reciente) |
| **Application mode** | `Production` |
| **Application root** | `topico.tudominio.com` |
| **Application URL** | `topico.tudominio.com` |
| **Application startup file** | `app.js` |

4. Clic en **"CREATE"**

> **📝 NOTA:** El archivo `app.js` en la raíz es el punto de entrada para Passenger. Este archivo simplemente carga `api/server.js`.

### 5.2 Instalar dependencias

Después de crear la aplicación, cPanel muestra un comando de activación. Cópialo.

1. En cPanel → **"Terminal"**
2. Ejecuta el comando de activación (ejemplo):

```bash
source /home/TU_USUARIO_CPANEL/nodevenv/topico.tudominio.com/18/bin/activate
```

3. Instala las dependencias:

```bash
cd ~/topico.tudominio.com/api
npm install --production
```

4. Verifica que se creó la carpeta `node_modules` dentro de `api/`

---

## 6. Configurar Variables de Entorno (.env)

### Opción A: Crear archivo `.env` en el servidor

1. En cPanel → **File Manager**
2. Navega a `/home/TU_USUARIO_CPANEL/topico.tudominio.com/api/`
3. Clic en **"+ Archivo"** → Nombre: `.env`
4. Clic derecho → **"Edit"** y escribe:

```env
# Base de Datos MySQL - Producción cPanel
DB_HOST=localhost
DB_USER=TU_USUARIO_CPANEL_topico_user
DB_PASSWORD=LA_CONTRASEÑA_QUE_GENERASTE
DB_NAME=TU_USUARIO_CPANEL_sistema_topico
DB_PORT=3306

# Puerto
PORT=3000

# Entorno
NODE_ENV=production
```

5. **Guardar**

### Opción B: Variables desde la interfaz de cPanel (alternativa)

1. Ve a **Setup Node.js App**
2. Clic en ✏️ (editar) tu aplicación
3. En **"Environment variables"**, agrega cada variable:

| Variable | Valor |
|---|---|
| `DB_HOST` | `localhost` |
| `DB_USER` | `TU_USUARIO_CPANEL_topico_user` |
| `DB_PASSWORD` | `LA_CONTRASEÑA_QUE_GENERASTE` |
| `DB_NAME` | `TU_USUARIO_CPANEL_sistema_topico` |
| `DB_PORT` | `3306` |
| `NODE_ENV` | `production` |

4. Clic en **"Save"**

> **🔴 IMPORTANTE:** Reemplaza `TU_USUARIO_CPANEL` con tu usuario real de cPanel (ej: `carhuaz`). Los nombres reales de BD y usuario llevan ese prefijo automáticamente.

---

## 7. Desplegar y Verificar

### 7.1 Reiniciar la aplicación

1. En cPanel → **"Setup Node.js App"**
2. Clic en el botón **"Restart"** ↻ de tu aplicación

### 7.2 Verificar que todo funcione

**Prueba 1 — Frontend:**
- Abre: `https://topico.tudominio.com`
- Debe aparecer la pantalla de **login** del sistema

**Prueba 2 — API Health Check:**
- Abre: `https://topico.tudominio.com/api/health`
- Debe mostrar:

```json
{
  "status": "ok",
  "conectado": true,
  "mensaje": "Conexión a la base de datos MySQL establecida con éxito.",
  "test": 2
}
```

**Prueba 3 — Login:**
- Ingresa con usuario: `admin`, contraseña: `1234`
- Debe entrar al dashboard del sistema

> **Si algo falla**, revisa la sección [Solución de Problemas](#9-solución-de-problemas-comunes) más abajo.

---

## 8. Actualizaciones Futuras (CI/CD)

### 8.1 Flujo manual (cada vez que hagas cambios)

```
PC Local                    GitHub                    cPanel (Servidor)
   │                          │                            │
   ├── git add .              │                            │
   ├── git commit -m "..."    │                            │
   ├── git push origin main ──►  Repositorio actualizado   │
   │                          │                            │
   │                          │    Git Version Control ────►  Update from Remote
   │                          │                            ├── npm install (si hay nuevas deps)
   │                          │                            └── Restart App Node.js
```

**Desde tu PC:**

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

**Desde cPanel:**

1. Ve a **Git Version Control** → tu repo → **"Manage"** → **"Update from Remote"**
2. Si cambiaste dependencias:
   ```bash
   source /home/TU_USUARIO_CPANEL/nodevenv/topico.tudominio.com/18/bin/activate
   cd ~/topico.tudominio.com/api
   npm install --production
   ```
3. Ve a **Setup Node.js App** → **"Restart"**

### 8.2 Deploy automático con `.cpanel.yml` (opcional)

Crea este archivo en la raíz de tu repositorio:

```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home/TU_USUARIO_CPANEL/topico.tudominio.com
    - cd $DEPLOYPATH/api && /home/TU_USUARIO_CPANEL/nodevenv/topico.tudominio.com/18/bin/npm install --production
```

Con esto, cada vez que hagas **"Update from Remote"** en Git Version Control, cPanel ejecuta `npm install` automáticamente.

### 8.3 Webhook de GitHub (opcional — deploy completamente automático)

1. En cPanel → **Git Version Control** → tu repo → copia la **URL de Deploy**
2. En GitHub → tu repo → **Settings** → **Webhooks** → **Add webhook**:

| Campo | Valor |
|---|---|
| **Payload URL** | La URL de deploy de cPanel |
| **Content type** | `application/json` |
| **Events** | Solo `push` |

3. Clic en **"Add webhook"**

Ahora cada `git push` despliega automáticamente.

---

## 9. Solución de Problemas Comunes

### ❌ Error 503 / "Application not started"

**Causa:** La app Node.js no arranca.

**Solución:**
1. En **Setup Node.js App** → clic en **"View stderr log"** para ver el error
2. Verifica que `app.js` existe en la raíz y que `api/server.js` existe
3. Prueba ejecutar manualmente desde la Terminal:
   ```bash
   source /home/TU_USUARIO_CPANEL/nodevenv/topico.tudominio.com/18/bin/activate
   cd ~/topico.tudominio.com
   node app.js
   ```

### ❌ Error: "ER_ACCESS_DENIED_ERROR"

**Causa:** Credenciales de BD incorrectas.

**Solución:**
1. Verifica el `.env` con los valores correctos
2. Recuerda que en cPanel el usuario y BD llevan el prefijo de tu cuenta: `USUARIO_CPANEL_`
3. Verifica los privilegios del usuario en **Bases de datos MySQL**

### ❌ Error: "ER_BAD_DB_ERROR"

**Causa:** La base de datos no existe con ese nombre.

**Solución:**
1. Ve a **phpMyAdmin** y verifica el nombre exacto de tu BD
2. Actualiza `DB_NAME` en tu `.env` con el nombre correcto

### ❌ Error: "Cannot find module 'express'"

**Causa:** Dependencias no instaladas.

**Solución:**
```bash
source /home/TU_USUARIO_CPANEL/nodevenv/topico.tudominio.com/18/bin/activate
cd ~/topico.tudominio.com/api
npm install --production
```

### ❌ El frontend carga pero la API no responde

**Causa:** El frontend no encuentra la API.

**Solución:**
1. Abre la consola del navegador (F12) → pestaña **Network/Red**
2. Verifica que las peticiones van a `https://topico.tudominio.com/api/...`
3. Prueba directo: `https://topico.tudominio.com/api/health`

### ❌ La página muestra "Index of /" en vez del sistema

**Causa:** Passenger no está corriendo la app Node.js.

**Solución:**
1. Verifica que la app está creada en **Setup Node.js App**
2. Verifica que el **Application startup file** sea `app.js`
3. Reinicia la aplicación

---

## 10. Checklist Final

Marca cada paso completado:

- [ ] Repositorio creado en GitHub (privado)
- [ ] Código subido con `git push origin main`
- [ ] Subdominio creado (`topico.tudominio.com`)
- [ ] Certificado SSL activado (HTTPS)
- [ ] Base de datos MySQL creada en cPanel
- [ ] Usuario MySQL creado y asignado con todos los privilegios
- [ ] Esquema SQL importado en phpMyAdmin
- [ ] Clave SSH generada y agregada en GitHub (Deploy keys)
- [ ] Repositorio clonado con Git Version Control
- [ ] Aplicación Node.js creada (Setup Node.js App)
- [ ] Dependencias instaladas (`npm install --production`)
- [ ] Archivo `.env` creado en el servidor con credenciales
- [ ] Aplicación reiniciada
- [ ] `https://topico.tudominio.com` muestra el login ✅
- [ ] `https://topico.tudominio.com/api/health` retorna `status: ok` ✅
- [ ] Login funciona con `admin / 1234` ✅

---

**✅ ¡Listo! Tu Sistema de Tópico está en la web.**

Cada vez que necesites actualizar: `git push` → Pull en cPanel → Restart.
