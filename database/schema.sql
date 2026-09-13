-- ================================================================
-- SISTEMA INTEGRAL DEL TÓPICO INSTITUCIONAL - IESTP CARHUAZ
-- SCRIPT DE BASE DE DATOS: MySQL / MariaDB (XAMPP phpMyAdmin)
-- ================================================================

-- 1. CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS `sistema_topico` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `sistema_topico`;

-- ================================================================
-- TABLA 1: USUARIOS / PERSONAL DE SALUD
-- ================================================================
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(150) NOT NULL COMMENT 'Nombre completo de la Licenciada o personal',
    `cep` VARCHAR(50) NOT NULL COMMENT 'Código del Colegio de Enfermeros del Perú',
    `usuario` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre de usuario para el login',
    `pass` VARCHAR(255) NOT NULL COMMENT 'Contraseña de acceso',
    `turno` ENUM('Mañana', 'Tarde', 'Noche') NOT NULL DEFAULT 'Mañana',
    `estado` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = Activo, 0 = Inactivo',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA 2: PACIENTES (FILIACIÓN E HISTORIA CLÍNICA)
-- ================================================================
DROP TABLE IF EXISTS `pacientes`;
CREATE TABLE `pacientes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `historia_clinica` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Número único de HC, ej. HC-74859612',
    `establecimiento` VARCHAR(150) NOT NULL DEFAULT 'IESTP CARHUAZ - TÓPICO INSTITUCIONAL',
    `fecha_registro` DATETIME NOT NULL,
    `dni` VARCHAR(15) NOT NULL UNIQUE COMMENT 'DNI o carnet de extranjería',
    `ape_paterno` VARCHAR(100) NOT NULL,
    `ape_materno` VARCHAR(100) NOT NULL,
    `nombres` VARCHAR(100) NOT NULL,
    `fecha_nacimiento` DATE NOT NULL,
    `edad` INT NOT NULL,
    `genero` VARCHAR(20) NOT NULL,
    `nacionalidad` VARCHAR(50) NOT NULL DEFAULT 'Peruana',
    `etnia` VARCHAR(50) DEFAULT 'Mestizo',
    `programa` VARCHAR(150) NOT NULL COMMENT 'Carrera técnica o condición institucional',
    `telefono` VARCHAR(20) DEFAULT NULL,
    `departamento` VARCHAR(50) DEFAULT NULL,
    `provincia` VARCHAR(50) DEFAULT NULL,
    `distrito` VARCHAR(50) DEFAULT NULL,
    `domicilio` VARCHAR(255) NOT NULL,
    `referencia` VARCHAR(255) DEFAULT NULL,
    -- Datos del Apoderado o Contacto de Emergencia
    `apoderado_dni` VARCHAR(15) DEFAULT NULL,
    `apoderado_nombres` VARCHAR(150) DEFAULT NULL,
    `apoderado_vinculo` VARCHAR(50) DEFAULT NULL,
    `apoderado_telefono` VARCHAR(20) DEFAULT NULL,
    `apoderado_ocupacion` VARCHAR(100) DEFAULT NULL,
    `apoderado_domicilio` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_dni` (`dni`),
    INDEX `idx_programa` (`programa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA 3: BOTIQUÍN E INSUMOS MÉDICOS
-- ================================================================
DROP TABLE IF EXISTS `medicamentos`;
CREATE TABLE `medicamentos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `codigo` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Código interno ej. MED-001',
    `nombre` VARCHAR(150) NOT NULL COMMENT 'Nombre comercial/genérico y concentración',
    `categoria` VARCHAR(100) NOT NULL COMMENT 'Tratamiento IRA, Tratamiento EDA, etc.',
    `stock` INT NOT NULL DEFAULT 0,
    `vencimiento` DATE NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_codigo` (`codigo`),
    INDEX `idx_categoria` (`categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA 4: ATENCIONES CLÍNICAS Y TRIAJE (IRAS / EDAS / GENERAL)
-- ================================================================
DROP TABLE IF EXISTS `atenciones`;
CREATE TABLE `atenciones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `fecha_atencion` DATETIME NOT NULL,
    `dni_paciente` VARCHAR(15) NOT NULL,
    `paciente_nombre` VARCHAR(200) NOT NULL,
    `programa` VARCHAR(150) NOT NULL,
    `temperatura` VARCHAR(20) DEFAULT NULL,
    `diagnostico` VARCHAR(50) NOT NULL COMMENT 'IRA, EDA o GENERAL',
    `subtipo` VARCHAR(150) DEFAULT NULL COMMENT 'Clasificación específica (ej. Neumonía, Plan A, etc.)',
    `tratamiento` TEXT DEFAULT NULL,
    `destino` VARCHAR(100) DEFAULT 'Tópico / Reposo',
    `licenciada` VARCHAR(150) DEFAULT NULL COMMENT 'Personal que realizó la atención',
    `observaciones` TEXT DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_atencion_dni` (`dni_paciente`),
    INDEX `idx_atencion_diagnostico` (`diagnostico`),
    INDEX `idx_atencion_fecha` (`fecha_atencion`),
    INDEX `idx_atencion_programa` (`programa`),
    CONSTRAINT `fk_atencion_paciente` 
        FOREIGN KEY (`dni_paciente`) REFERENCES `pacientes` (`dni`) 
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA 5: DERIVACIONES Y REFERENCIAS EXTERNAS
-- ================================================================
DROP TABLE IF EXISTS `derivaciones`;
CREATE TABLE `derivaciones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `fecha_derivacion` DATETIME NOT NULL,
    `dni_paciente` VARCHAR(15) NOT NULL,
    `paciente_nombre` VARCHAR(200) DEFAULT NULL,
    `establecimiento_destino` VARCHAR(200) NOT NULL,
    `motivo` TEXT NOT NULL,
    `acompanante` VARCHAR(150) DEFAULT NULL,
    `personal_responsable` VARCHAR(150) DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_derivacion_dni` (`dni_paciente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- DATOS INICIALES POR DEFECTO (SEMILLAS / SEEDERS)
-- ================================================================

-- Usuario administrador inicial
INSERT INTO `usuarios` (`nombre`, `cep`, `usuario`, `pass`, `turno`) VALUES
('Lic. Enfermería Tópico', 'CEP-45123', 'admin', '1234', 'Mañana')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Medicamentos esenciales del botiquín
INSERT INTO `medicamentos` (`codigo`, `nombre`, `categoria`, `stock`, `vencimiento`) VALUES
('MED-001', 'Paracetamol 500mg', 'Tratamiento IRA', 50, '2027-12-31'),
('MED-002', 'Sales de Rehidratación Oral (SRO)', 'Tratamiento EDA', 40, '2027-10-15'),
('MED-003', 'Ibuprofeno 400mg', 'Primeros Auxilios', 30, '2027-08-20'),
('MED-004', 'Alcohol Medicinal 70° 1L', 'Primeros Auxilios', 15, '2028-01-01'),
('MED-005', 'Algodón Hidrófilo 500g', 'Primeros Auxilios', 10, '2028-06-30')
ON DUPLICATE KEY UPDATE `codigo`=`codigo`;

-- Paciente demo de prueba
INSERT INTO `pacientes` (
    `historia_clinica`, `establecimiento`, `fecha_registro`, `dni`, 
    `ape_paterno`, `ape_materno`, `nombres`, `fecha_nacimiento`, `edad`, 
    `genero`, `nacionalidad`, `etnia`, `programa`, `telefono`, 
    `departamento`, `provincia`, `distrito`, `domicilio`, `referencia`,
    `apoderado_dni`, `apoderado_nombres`, `apoderado_vinculo`, `apoderado_telefono`, `apoderado_ocupacion`, `apoderado_domicilio`
) VALUES (
    'HC-70000001', 'IESTP CARHUAZ - TÓPICO INSTITUCIONAL', NOW(), '70000001',
    'QUISPE', 'FLORES', 'JUAN CARLOS', '2004-05-15', 21,
    'Masculino', 'Peruana', 'Mestizo', 'Arquitectura de Plataformas y Servicios de Tecnologías de la Información', '987654321',
    'ANCASH', 'CARHUAZ', 'CARHUAZ', 'Jr. La Merced 450', 'Frente a la Plaza de Armas',
    '40000001', 'QUISPE RAMIREZ MANUEL', 'Padre', '987111222', 'Comerciante', 'Jr. La Merced 450'
) ON DUPLICATE KEY UPDATE `dni`=`dni`;
