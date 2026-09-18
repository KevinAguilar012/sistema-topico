-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bd_topico_instituto
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrativo`
--

DROP TABLE IF EXISTS `administrativo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrativo` (
  `idadministrativo` int NOT NULL AUTO_INCREMENT,
  `cargo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_contrato` date DEFAULT NULL,
  `estado` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `persona_idpersona` int NOT NULL,
  PRIMARY KEY (`idadministrativo`),
  UNIQUE KEY `uk_administrativo_persona` (`persona_idpersona`),
  CONSTRAINT `fk_administrativo_persona` FOREIGN KEY (`persona_idpersona`) REFERENCES `persona` (`idpersona`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrativo`
--

LOCK TABLES `administrativo` WRITE;
/*!40000 ALTER TABLE `administrativo` DISABLE KEYS */;
INSERT INTO `administrativo` VALUES (1,'Director','Dirección','2024-01-15','ACTIVO',51),(2,'Secretaria','Administración','2024-02-01','ACTIVO',52),(3,'Coordinador Académico','Académica','2024-03-01','ACTIVO',53),(4,'Técnico de Soporte','Tecnologías de Información','2025-01-10','ACTIVO',54);
/*!40000 ALTER TABLE `administrativo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `atencion`
--

DROP TABLE IF EXISTS `atencion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atencion` (
  `idatencion` int NOT NULL AUTO_INCREMENT,
  `codigo_atencion` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_atencion` date NOT NULL,
  `hora_atencion` time NOT NULL,
  `motivo_consulta` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `persona_idpersona` int NOT NULL,
  `usuario_idusuario` int NOT NULL,
  `tipo_atencion_idtipo_atencion` int NOT NULL,
  PRIMARY KEY (`idatencion`),
  UNIQUE KEY `uk_atencion_codigo` (`codigo_atencion`),
  KEY `fk_atencion_persona` (`persona_idpersona`),
  KEY `fk_atencion_usuario` (`usuario_idusuario`),
  KEY `fk_atencion_tipo` (`tipo_atencion_idtipo_atencion`),
  CONSTRAINT `fk_atencion_persona` FOREIGN KEY (`persona_idpersona`) REFERENCES `persona` (`idpersona`),
  CONSTRAINT `fk_atencion_tipo` FOREIGN KEY (`tipo_atencion_idtipo_atencion`) REFERENCES `tipo_atencion` (`idtipo_atencion`),
  CONSTRAINT `fk_atencion_usuario` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atencion`
--

LOCK TABLES `atencion` WRITE;
/*!40000 ALTER TABLE `atencion` DISABLE KEYS */;
INSERT INTO `atencion` VALUES (1,'ATN-0001','2026-02-01','08:15:00','Síntomas respiratorios','Atención y orientación registrada.',1,1,1),(2,'ATN-0002','2026-02-02','09:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',2,2,2),(3,'ATN-0003','2026-02-03','10:15:00','Síntomas respiratorios','Atención y orientación registrada.',3,3,1),(4,'ATN-0004','2026-02-04','11:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',4,4,2),(5,'ATN-0005','2026-02-05','12:15:00','Síntomas respiratorios','Atención y orientación registrada.',5,5,1),(6,'ATN-0006','2026-02-06','13:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',6,6,2),(7,'ATN-0007','2026-02-07','14:15:00','Síntomas respiratorios','Atención y orientación registrada.',7,7,1),(8,'ATN-0008','2026-02-08','15:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',8,8,2),(9,'ATN-0009','2026-02-09','08:15:00','Síntomas respiratorios','Atención y orientación registrada.',9,1,1),(10,'ATN-0010','2026-02-10','09:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',10,2,2),(11,'ATN-0011','2026-02-11','10:15:00','Síntomas respiratorios','Atención y orientación registrada.',11,3,1),(12,'ATN-0012','2026-02-12','11:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',12,4,2),(13,'ATN-0013','2026-02-13','12:15:00','Síntomas respiratorios','Atención y orientación registrada.',13,5,1),(14,'ATN-0014','2026-02-14','13:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',14,6,2),(15,'ATN-0015','2026-02-15','14:15:00','Síntomas respiratorios','Atención y orientación registrada.',15,7,1),(16,'ATN-0016','2026-02-16','15:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',16,8,2),(17,'ATN-0017','2026-02-17','08:15:00','Síntomas respiratorios','Atención y orientación registrada.',17,1,1),(18,'ATN-0018','2026-02-18','09:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',18,2,2),(19,'ATN-0019','2026-02-19','10:15:00','Síntomas respiratorios','Atención y orientación registrada.',19,3,1),(20,'ATN-0020','2026-02-20','11:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',20,4,2),(21,'ATN-0021','2026-02-21','12:15:00','Síntomas respiratorios','Atención y orientación registrada.',21,5,1),(22,'ATN-0022','2026-02-22','13:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',22,6,2),(23,'ATN-0023','2026-02-23','14:15:00','Síntomas respiratorios','Atención y orientación registrada.',23,7,1),(24,'ATN-0024','2026-02-24','15:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',24,8,2),(25,'ATN-0025','2026-02-25','08:15:00','Síntomas respiratorios','Atención y orientación registrada.',25,1,1),(26,'ATN-0026','2026-02-26','09:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',26,2,2),(27,'ATN-0027','2026-02-27','10:15:00','Síntomas respiratorios','Atención y orientación registrada.',27,3,1),(28,'ATN-0028','2026-02-28','11:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',28,4,2),(29,'ATN-0029','2026-03-01','12:15:00','Síntomas respiratorios','Atención y orientación registrada.',29,5,1),(30,'ATN-0030','2026-03-02','13:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',30,6,2),(31,'ATN-0031','2026-03-03','14:15:00','Síntomas respiratorios','Atención y orientación registrada.',31,7,1),(32,'ATN-0032','2026-03-04','15:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',32,8,2),(33,'ATN-0033','2026-03-05','08:15:00','Síntomas respiratorios','Atención y orientación registrada.',33,1,1),(34,'ATN-0034','2026-03-06','09:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',34,2,2),(35,'ATN-0035','2026-03-07','10:15:00','Síntomas respiratorios','Atención y orientación registrada.',35,3,1),(36,'ATN-0036','2026-03-08','11:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',36,4,2),(37,'ATN-0037','2026-03-09','12:15:00','Síntomas respiratorios','Atención y orientación registrada.',37,5,1),(38,'ATN-0038','2026-03-10','13:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',38,6,2),(39,'ATN-0039','2026-03-11','14:15:00','Síntomas respiratorios','Atención y orientación registrada.',39,7,1),(40,'ATN-0040','2026-03-12','15:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',40,8,2),(41,'ATN-0041','2026-03-13','08:15:00','Síntomas respiratorios','Atención y orientación registrada.',41,1,1),(42,'ATN-0042','2026-03-14','09:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',42,2,2),(43,'ATN-0043','2026-03-15','10:15:00','Síntomas respiratorios','Atención y orientación registrada.',43,3,1),(44,'ATN-0044','2026-03-16','11:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',44,4,2),(45,'ATN-0045','2026-03-17','12:15:00','Síntomas respiratorios','Atención y orientación registrada.',45,5,1),(46,'ATN-0046','2026-03-18','13:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',46,6,2),(47,'ATN-0047','2026-03-19','14:15:00','Síntomas respiratorios','Atención y orientación registrada.',47,7,1),(48,'ATN-0048','2026-03-20','15:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',48,8,2),(49,'ATN-0049','2026-03-21','08:15:00','Síntomas respiratorios','Atención y orientación registrada.',49,1,1),(50,'ATN-0050','2026-03-22','09:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',50,2,2),(51,'ATN-0051','2026-03-23','10:15:00','Síntomas respiratorios','Atención y orientación registrada.',51,3,1),(52,'ATN-0052','2026-03-24','11:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',52,4,2),(53,'ATN-0053','2026-03-25','12:15:00','Síntomas respiratorios','Atención y orientación registrada.',53,5,1),(54,'ATN-0054','2026-03-26','13:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',54,6,2),(55,'ATN-0055','2026-03-27','14:15:00','Síntomas respiratorios','Atención y orientación registrada.',55,7,1),(56,'ATN-0056','2026-03-28','15:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',56,8,2),(57,'ATN-0057','2026-03-29','08:15:00','Síntomas respiratorios','Atención y orientación registrada.',57,1,1),(58,'ATN-0058','2026-03-30','09:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',58,2,2),(59,'ATN-0059','2026-03-31','10:15:00','Síntomas respiratorios','Atención y orientación registrada.',59,3,1),(60,'ATN-0060','2026-04-01','11:45:00','Síntomas gastrointestinales','Atención y orientación registrada.',60,4,2);
/*!40000 ALTER TABLE `atencion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `atencion_diagnostico`
--

DROP TABLE IF EXISTS `atencion_diagnostico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atencion_diagnostico` (
  `atencion_idatencion` int NOT NULL,
  `enfermedad_idenfermedad` int NOT NULL,
  `observacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`atencion_idatencion`,`enfermedad_idenfermedad`),
  KEY `fk_diagnostico_enfermedad` (`enfermedad_idenfermedad`),
  CONSTRAINT `fk_diagnostico_atencion` FOREIGN KEY (`atencion_idatencion`) REFERENCES `atencion` (`idatencion`),
  CONSTRAINT `fk_diagnostico_enfermedad` FOREIGN KEY (`enfermedad_idenfermedad`) REFERENCES `enfermedad` (`idenfermedad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atencion_diagnostico`
--

LOCK TABLES `atencion_diagnostico` WRITE;
/*!40000 ALTER TABLE `atencion_diagnostico` DISABLE KEYS */;
INSERT INTO `atencion_diagnostico` VALUES (1,1,'Diagnóstico registrado según evaluación clínica.'),(2,2,'Diagnóstico registrado según evaluación clínica.'),(3,1,'Diagnóstico registrado según evaluación clínica.'),(4,2,'Diagnóstico registrado según evaluación clínica.'),(5,1,'Diagnóstico registrado según evaluación clínica.'),(6,2,'Diagnóstico registrado según evaluación clínica.'),(7,1,'Diagnóstico registrado según evaluación clínica.'),(8,2,'Diagnóstico registrado según evaluación clínica.'),(9,1,'Diagnóstico registrado según evaluación clínica.'),(10,2,'Diagnóstico registrado según evaluación clínica.'),(11,1,'Diagnóstico registrado según evaluación clínica.'),(12,2,'Diagnóstico registrado según evaluación clínica.'),(13,1,'Diagnóstico registrado según evaluación clínica.'),(14,2,'Diagnóstico registrado según evaluación clínica.'),(15,1,'Diagnóstico registrado según evaluación clínica.'),(16,2,'Diagnóstico registrado según evaluación clínica.'),(17,1,'Diagnóstico registrado según evaluación clínica.'),(18,2,'Diagnóstico registrado según evaluación clínica.'),(19,1,'Diagnóstico registrado según evaluación clínica.'),(20,2,'Diagnóstico registrado según evaluación clínica.'),(21,1,'Diagnóstico registrado según evaluación clínica.'),(22,2,'Diagnóstico registrado según evaluación clínica.'),(23,1,'Diagnóstico registrado según evaluación clínica.'),(24,2,'Diagnóstico registrado según evaluación clínica.'),(25,1,'Diagnóstico registrado según evaluación clínica.'),(26,2,'Diagnóstico registrado según evaluación clínica.'),(27,1,'Diagnóstico registrado según evaluación clínica.'),(28,2,'Diagnóstico registrado según evaluación clínica.'),(29,1,'Diagnóstico registrado según evaluación clínica.'),(30,2,'Diagnóstico registrado según evaluación clínica.'),(31,1,'Diagnóstico registrado según evaluación clínica.'),(32,2,'Diagnóstico registrado según evaluación clínica.'),(33,1,'Diagnóstico registrado según evaluación clínica.'),(34,2,'Diagnóstico registrado según evaluación clínica.'),(35,1,'Diagnóstico registrado según evaluación clínica.'),(36,2,'Diagnóstico registrado según evaluación clínica.'),(37,1,'Diagnóstico registrado según evaluación clínica.'),(38,2,'Diagnóstico registrado según evaluación clínica.'),(39,1,'Diagnóstico registrado según evaluación clínica.'),(40,2,'Diagnóstico registrado según evaluación clínica.'),(41,1,'Diagnóstico registrado según evaluación clínica.'),(42,2,'Diagnóstico registrado según evaluación clínica.'),(43,1,'Diagnóstico registrado según evaluación clínica.'),(44,2,'Diagnóstico registrado según evaluación clínica.'),(45,1,'Diagnóstico registrado según evaluación clínica.'),(46,2,'Diagnóstico registrado según evaluación clínica.'),(47,1,'Diagnóstico registrado según evaluación clínica.'),(48,2,'Diagnóstico registrado según evaluación clínica.'),(49,1,'Diagnóstico registrado según evaluación clínica.'),(50,2,'Diagnóstico registrado según evaluación clínica.'),(51,1,'Diagnóstico registrado según evaluación clínica.'),(52,2,'Diagnóstico registrado según evaluación clínica.'),(53,1,'Diagnóstico registrado según evaluación clínica.'),(54,2,'Diagnóstico registrado según evaluación clínica.'),(55,1,'Diagnóstico registrado según evaluación clínica.'),(56,2,'Diagnóstico registrado según evaluación clínica.'),(57,1,'Diagnóstico registrado según evaluación clínica.'),(58,2,'Diagnóstico registrado según evaluación clínica.'),(59,1,'Diagnóstico registrado según evaluación clínica.'),(60,2,'Diagnóstico registrado según evaluación clínica.');
/*!40000 ALTER TABLE `atencion_diagnostico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `atencion_eda`
--

DROP TABLE IF EXISTS `atencion_eda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atencion_eda` (
  `idatencion_eda` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tiempo_enfermedad` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_deposiciones` int DEFAULT NULL,
  `caracteristicas_heces` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `presencia_sangre` tinyint(1) DEFAULT NULL,
  `presencia_moco` tinyint(1) DEFAULT NULL,
  `vomitos` tinyint(1) DEFAULT NULL,
  `dolor_abdominal` tinyint(1) DEFAULT NULL,
  `sed` tinyint(1) DEFAULT NULL,
  `capacidad_beber` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ojos_hundidos` tinyint(1) DEFAULT NULL,
  `mucosa_seca` tinyint(1) DEFAULT NULL,
  `signos_deshidratacion` text COLLATE utf8mb4_unicode_ci,
  `clasificacion` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `atencion_idatencion` int NOT NULL,
  PRIMARY KEY (`idatencion_eda`),
  KEY `fk_eda_atencion` (`atencion_idatencion`),
  CONSTRAINT `fk_eda_atencion` FOREIGN KEY (`atencion_idatencion`) REFERENCES `atencion` (`idatencion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atencion_eda`
--

LOCK TABLES `atencion_eda` WRITE;
/*!40000 ALTER TABLE `atencion_eda` DISABLE KEYS */;
INSERT INTO `atencion_eda` VALUES ('EDA-0002','2 días',5,'Líquidas',0,0,0,1,0,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',2),('EDA-0004','2 días',7,'Líquidas',0,0,0,0,0,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',4),('EDA-0006','2 días',4,'Líquidas',0,0,1,1,1,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',6),('EDA-0008','2 días',6,'Líquidas',0,0,0,0,0,'Bebe adecuadamente',0,1,'Sed y mucosa seca','EDA con signos de deshidratación','Control de hidratación.',8),('EDA-0010','2 días',3,'Líquidas',0,0,0,1,0,'Bebe adecuadamente',1,0,'Sin signos relevantes','EDA con signos de deshidratación','Control de hidratación.',10),('EDA-0012','2 días',5,'Líquidas',0,0,1,0,1,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',12),('EDA-0014','2 días',7,'Líquidas',0,0,0,1,0,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',14),('EDA-0016','2 días',4,'Líquidas',0,0,0,0,0,'Bebe adecuadamente',0,1,'Sed y mucosa seca','EDA con signos de deshidratación','Control de hidratación.',16),('EDA-0018','2 días',6,'Líquidas',0,0,1,1,1,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',18),('EDA-0020','2 días',3,'Líquidas',0,0,0,0,0,'Bebe adecuadamente',1,0,'Sin signos relevantes','EDA con signos de deshidratación','Control de hidratación.',20),('EDA-0022','2 días',5,'Líquidas',0,0,0,1,0,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',22),('EDA-0024','2 días',7,'Líquidas',0,0,1,0,1,'Bebe adecuadamente',0,1,'Sed y mucosa seca','EDA con signos de deshidratación','Control de hidratación.',24),('EDA-0026','2 días',4,'Líquidas',0,0,0,1,0,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',26),('EDA-0028','2 días',6,'Líquidas',0,0,0,0,0,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',28),('EDA-0030','2 días',3,'Líquidas',0,0,1,1,1,'Bebe adecuadamente',1,0,'Sin signos relevantes','EDA con signos de deshidratación','Control de hidratación.',30),('EDA-0032','2 días',5,'Líquidas',0,0,0,0,0,'Bebe adecuadamente',0,1,'Sed y mucosa seca','EDA con signos de deshidratación','Control de hidratación.',32),('EDA-0034','2 días',7,'Líquidas',0,0,0,1,0,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',34),('EDA-0036','2 días',4,'Líquidas',0,0,1,0,1,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',36),('EDA-0038','2 días',6,'Líquidas',0,0,0,1,0,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',38),('EDA-0040','2 días',3,'Líquidas',0,0,0,0,0,'Bebe adecuadamente',1,1,'Sed y mucosa seca','EDA con signos de deshidratación','Control de hidratación.',40),('EDA-0042','2 días',5,'Líquidas',0,0,1,1,1,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',42),('EDA-0044','2 días',7,'Líquidas',0,0,0,0,0,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',44),('EDA-0046','2 días',4,'Líquidas',0,0,0,1,0,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',46),('EDA-0048','2 días',6,'Líquidas',0,0,1,0,1,'Bebe adecuadamente',0,1,'Sed y mucosa seca','EDA con signos de deshidratación','Control de hidratación.',48),('EDA-0050','2 días',3,'Líquidas',0,0,0,1,0,'Bebe adecuadamente',1,0,'Sin signos relevantes','EDA con signos de deshidratación','Control de hidratación.',50),('EDA-0052','2 días',5,'Líquidas',0,0,0,0,0,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',52),('EDA-0054','2 días',7,'Líquidas',0,0,1,1,1,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',54),('EDA-0056','2 días',4,'Líquidas',0,0,0,0,0,'Bebe adecuadamente',0,1,'Sed y mucosa seca','EDA con signos de deshidratación','Control de hidratación.',56),('EDA-0058','2 días',6,'Líquidas',0,0,0,1,0,'Bebe adecuadamente',0,0,'Sin signos relevantes','EDA sin signos de deshidratación','Control de hidratación.',58),('EDA-0060','2 días',3,'Líquidas',0,0,1,0,1,'Bebe adecuadamente',1,0,'Sin signos relevantes','EDA con signos de deshidratación','Control de hidratación.',60);
/*!40000 ALTER TABLE `atencion_eda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `atencion_ira`
--

DROP TABLE IF EXISTS `atencion_ira`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atencion_ira` (
  `idatencion_ira` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tiempo_enfermedad` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiraje` tinyint(1) DEFAULT NULL,
  `sibilancias` tinyint(1) DEFAULT NULL,
  `estridor` tinyint(1) DEFAULT NULL,
  `signos_alarma` text COLLATE utf8mb4_unicode_ci,
  `clasificacion` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `atencion_idatencion` int NOT NULL,
  PRIMARY KEY (`idatencion_ira`),
  KEY `fk_ira_atencion` (`atencion_idatencion`),
  CONSTRAINT `fk_ira_atencion` FOREIGN KEY (`atencion_idatencion`) REFERENCES `atencion` (`idatencion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atencion_ira`
--

LOCK TABLES `atencion_ira` WRITE;
/*!40000 ALTER TABLE `atencion_ira` DISABLE KEYS */;
INSERT INTO `atencion_ira` VALUES ('IRA-0001','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',1),('IRA-0003','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',3),('IRA-0005','3 días',0,1,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',5),('IRA-0007','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',7),('IRA-0009','3 días',1,0,0,'Dificultad respiratoria','IRA con signo de alarma','Vigilancia de evolución.',9),('IRA-0011','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',11),('IRA-0013','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',13),('IRA-0015','3 días',0,1,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',15),('IRA-0017','3 días',0,0,1,'Sin signos de alarma','IRA con signo de alarma','Vigilancia de evolución.',17),('IRA-0019','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',19),('IRA-0021','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',21),('IRA-0023','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',23),('IRA-0025','3 días',0,1,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',25),('IRA-0027','3 días',1,0,0,'Dificultad respiratoria','IRA con signo de alarma','Vigilancia de evolución.',27),('IRA-0029','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',29),('IRA-0031','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',31),('IRA-0033','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',33),('IRA-0035','3 días',0,1,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',35),('IRA-0037','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',37),('IRA-0039','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',39),('IRA-0041','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',41),('IRA-0043','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',43),('IRA-0045','3 días',1,1,0,'Dificultad respiratoria','IRA con signo de alarma','Vigilancia de evolución.',45),('IRA-0047','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',47),('IRA-0049','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',49),('IRA-0051','3 días',0,0,1,'Sin signos de alarma','IRA con signo de alarma','Vigilancia de evolución.',51),('IRA-0053','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',53),('IRA-0055','3 días',0,1,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',55),('IRA-0057','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',57),('IRA-0059','3 días',0,0,0,'Sin signos de alarma','IRA sin signos de alarma','Vigilancia de evolución.',59);
/*!40000 ALTER TABLE `atencion_ira` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `atencion_sintoma`
--

DROP TABLE IF EXISTS `atencion_sintoma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atencion_sintoma` (
  `idatencion_sintoma` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `presente` tinyint(1) NOT NULL DEFAULT '1',
  `observacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `atencion_idatencion` int NOT NULL,
  `sintoma_idsintoma` int NOT NULL,
  PRIMARY KEY (`idatencion_sintoma`,`atencion_idatencion`,`sintoma_idsintoma`),
  KEY `fk_atencion_sintoma_atencion` (`atencion_idatencion`),
  KEY `fk_atencion_sintoma_sintoma` (`sintoma_idsintoma`),
  CONSTRAINT `fk_atencion_sintoma_atencion` FOREIGN KEY (`atencion_idatencion`) REFERENCES `atencion` (`idatencion`),
  CONSTRAINT `fk_atencion_sintoma_sintoma` FOREIGN KEY (`sintoma_idsintoma`) REFERENCES `sintoma` (`idsintoma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atencion_sintoma`
--

LOCK TABLES `atencion_sintoma` WRITE;
/*!40000 ALTER TABLE `atencion_sintoma` DISABLE KEYS */;
INSERT INTO `atencion_sintoma` VALUES ('AS-0001',1,'Síntoma registrado durante la atención.',1,1),('AS-0002',1,'Síntoma registrado durante la atención.',1,2),('AS-0003',1,'Síntoma registrado durante la atención.',2,5),('AS-0004',1,'Síntoma registrado durante la atención.',2,6),('AS-0005',1,'Síntoma registrado durante la atención.',3,2),('AS-0006',1,'Síntoma registrado durante la atención.',3,3),('AS-0007',1,'Síntoma registrado durante la atención.',4,5),('AS-0008',1,'Síntoma registrado durante la atención.',4,6),('AS-0009',1,'Síntoma registrado durante la atención.',5,1),('AS-0010',1,'Síntoma registrado durante la atención.',5,2),('AS-0011',1,'Síntoma registrado durante la atención.',6,5),('AS-0012',1,'Síntoma registrado durante la atención.',6,7),('AS-0013',1,'Síntoma registrado durante la atención.',7,1),('AS-0014',1,'Síntoma registrado durante la atención.',7,2),('AS-0015',1,'Síntoma registrado durante la atención.',8,5),('AS-0016',1,'Síntoma registrado durante la atención.',8,6),('AS-0017',1,'Síntoma registrado durante la atención.',9,2),('AS-0018',1,'Síntoma registrado durante la atención.',9,3),('AS-0019',1,'Síntoma registrado durante la atención.',10,5),('AS-0020',1,'Síntoma registrado durante la atención.',10,6),('AS-0021',1,'Síntoma registrado durante la atención.',11,1),('AS-0022',1,'Síntoma registrado durante la atención.',11,2),('AS-0023',1,'Síntoma registrado durante la atención.',12,5),('AS-0024',1,'Síntoma registrado durante la atención.',12,7),('AS-0025',1,'Síntoma registrado durante la atención.',13,1),('AS-0026',1,'Síntoma registrado durante la atención.',13,2),('AS-0027',1,'Síntoma registrado durante la atención.',14,5),('AS-0028',1,'Síntoma registrado durante la atención.',14,6),('AS-0029',1,'Síntoma registrado durante la atención.',15,2),('AS-0030',1,'Síntoma registrado durante la atención.',15,3),('AS-0031',1,'Síntoma registrado durante la atención.',16,5),('AS-0032',1,'Síntoma registrado durante la atención.',16,6),('AS-0033',1,'Síntoma registrado durante la atención.',17,1),('AS-0034',1,'Síntoma registrado durante la atención.',17,2),('AS-0035',1,'Síntoma registrado durante la atención.',18,5),('AS-0036',1,'Síntoma registrado durante la atención.',18,7),('AS-0037',1,'Síntoma registrado durante la atención.',19,1),('AS-0038',1,'Síntoma registrado durante la atención.',19,2),('AS-0039',1,'Síntoma registrado durante la atención.',20,5),('AS-0040',1,'Síntoma registrado durante la atención.',20,6),('AS-0041',1,'Síntoma registrado durante la atención.',21,2),('AS-0042',1,'Síntoma registrado durante la atención.',21,3),('AS-0043',1,'Síntoma registrado durante la atención.',22,5),('AS-0044',1,'Síntoma registrado durante la atención.',22,6),('AS-0045',1,'Síntoma registrado durante la atención.',23,1),('AS-0046',1,'Síntoma registrado durante la atención.',23,2),('AS-0047',1,'Síntoma registrado durante la atención.',24,5),('AS-0048',1,'Síntoma registrado durante la atención.',24,7),('AS-0049',1,'Síntoma registrado durante la atención.',25,1),('AS-0050',1,'Síntoma registrado durante la atención.',25,2),('AS-0051',1,'Síntoma registrado durante la atención.',26,5),('AS-0052',1,'Síntoma registrado durante la atención.',26,6),('AS-0053',1,'Síntoma registrado durante la atención.',27,2),('AS-0054',1,'Síntoma registrado durante la atención.',27,3),('AS-0055',1,'Síntoma registrado durante la atención.',28,5),('AS-0056',1,'Síntoma registrado durante la atención.',28,6),('AS-0057',1,'Síntoma registrado durante la atención.',29,1),('AS-0058',1,'Síntoma registrado durante la atención.',29,2),('AS-0059',1,'Síntoma registrado durante la atención.',30,5),('AS-0060',1,'Síntoma registrado durante la atención.',30,7),('AS-0061',1,'Síntoma registrado durante la atención.',31,1),('AS-0062',1,'Síntoma registrado durante la atención.',31,2),('AS-0063',1,'Síntoma registrado durante la atención.',32,5),('AS-0064',1,'Síntoma registrado durante la atención.',32,6),('AS-0065',1,'Síntoma registrado durante la atención.',33,2),('AS-0066',1,'Síntoma registrado durante la atención.',33,3),('AS-0067',1,'Síntoma registrado durante la atención.',34,5),('AS-0068',1,'Síntoma registrado durante la atención.',34,6),('AS-0069',1,'Síntoma registrado durante la atención.',35,1),('AS-0070',1,'Síntoma registrado durante la atención.',35,2),('AS-0071',1,'Síntoma registrado durante la atención.',36,5),('AS-0072',1,'Síntoma registrado durante la atención.',36,7),('AS-0073',1,'Síntoma registrado durante la atención.',37,1),('AS-0074',1,'Síntoma registrado durante la atención.',37,2),('AS-0075',1,'Síntoma registrado durante la atención.',38,5),('AS-0076',1,'Síntoma registrado durante la atención.',38,6),('AS-0077',1,'Síntoma registrado durante la atención.',39,2),('AS-0078',1,'Síntoma registrado durante la atención.',39,3),('AS-0079',1,'Síntoma registrado durante la atención.',40,5),('AS-0080',1,'Síntoma registrado durante la atención.',40,6),('AS-0081',1,'Síntoma registrado durante la atención.',41,1),('AS-0082',1,'Síntoma registrado durante la atención.',41,2),('AS-0083',1,'Síntoma registrado durante la atención.',42,5),('AS-0084',1,'Síntoma registrado durante la atención.',42,7),('AS-0085',1,'Síntoma registrado durante la atención.',43,1),('AS-0086',1,'Síntoma registrado durante la atención.',43,2),('AS-0087',1,'Síntoma registrado durante la atención.',44,5),('AS-0088',1,'Síntoma registrado durante la atención.',44,6),('AS-0089',1,'Síntoma registrado durante la atención.',45,2),('AS-0090',1,'Síntoma registrado durante la atención.',45,3),('AS-0091',1,'Síntoma registrado durante la atención.',46,5),('AS-0092',1,'Síntoma registrado durante la atención.',46,6),('AS-0093',1,'Síntoma registrado durante la atención.',47,1),('AS-0094',1,'Síntoma registrado durante la atención.',47,2),('AS-0095',1,'Síntoma registrado durante la atención.',48,5),('AS-0096',1,'Síntoma registrado durante la atención.',48,7),('AS-0097',1,'Síntoma registrado durante la atención.',49,1),('AS-0098',1,'Síntoma registrado durante la atención.',49,2),('AS-0099',1,'Síntoma registrado durante la atención.',50,5),('AS-0100',1,'Síntoma registrado durante la atención.',50,6),('AS-0101',1,'Síntoma registrado durante la atención.',51,2),('AS-0102',1,'Síntoma registrado durante la atención.',51,3),('AS-0103',1,'Síntoma registrado durante la atención.',52,5),('AS-0104',1,'Síntoma registrado durante la atención.',52,6),('AS-0105',1,'Síntoma registrado durante la atención.',53,1),('AS-0106',1,'Síntoma registrado durante la atención.',53,2),('AS-0107',1,'Síntoma registrado durante la atención.',54,5),('AS-0108',1,'Síntoma registrado durante la atención.',54,7),('AS-0109',1,'Síntoma registrado durante la atención.',55,1),('AS-0110',1,'Síntoma registrado durante la atención.',55,2),('AS-0111',1,'Síntoma registrado durante la atención.',56,5),('AS-0112',1,'Síntoma registrado durante la atención.',56,6),('AS-0113',1,'Síntoma registrado durante la atención.',57,2),('AS-0114',1,'Síntoma registrado durante la atención.',57,3),('AS-0115',1,'Síntoma registrado durante la atención.',58,5),('AS-0116',1,'Síntoma registrado durante la atención.',58,6),('AS-0117',1,'Síntoma registrado durante la atención.',59,1),('AS-0118',1,'Síntoma registrado durante la atención.',59,2),('AS-0119',1,'Síntoma registrado durante la atención.',60,5),('AS-0120',1,'Síntoma registrado durante la atención.',60,7);
/*!40000 ALTER TABLE `atencion_sintoma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrera`
--

DROP TABLE IF EXISTS `carrera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrera` (
  `idcarrera` int NOT NULL AUTO_INCREMENT,
  `nombre_carrera` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  PRIMARY KEY (`idcarrera`),
  UNIQUE KEY `uk_carrera_nombre` (`nombre_carrera`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrera`
--

LOCK TABLES `carrera` WRITE;
/*!40000 ALTER TABLE `carrera` DISABLE KEYS */;
INSERT INTO `carrera` VALUES (1,'Enfermería Técnica','Formación técnica en atención y cuidados de salud.','1'),(2,'Arquitectura de Plataformas y Servicios TI','Formación técnica en infraestructura, plataformas y servicios TI.','1');
/*!40000 ALTER TABLE `carrera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departamento`
--

DROP TABLE IF EXISTS `departamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamento` (
  `iddepartamento` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pais_idpais` int NOT NULL,
  PRIMARY KEY (`iddepartamento`),
  KEY `fk_departamento_pais` (`pais_idpais`),
  CONSTRAINT `fk_departamento_pais` FOREIGN KEY (`pais_idpais`) REFERENCES `pais` (`idpais`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamento`
--

LOCK TABLES `departamento` WRITE;
/*!40000 ALTER TABLE `departamento` DISABLE KEYS */;
INSERT INTO `departamento` VALUES (1,'Lima',1),(2,'Arequipa',1),(3,'Cusco',1),(4,'La Libertad',1),(5,'Piura',1),(6,'Junín',1),(7,'Puno',1),(8,'Cajamarca',1),(9,'Lambayeque',1),(10,'Loreto',1);
/*!40000 ALTER TABLE `departamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_receta`
--

DROP TABLE IF EXISTS `detalle_receta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_receta` (
  `iddetalle_receta` int NOT NULL AUTO_INCREMENT,
  `receta_idreceta` int NOT NULL,
  `medicamento_idmedicamento` int NOT NULL,
  `tipo_administracion_idtipo_administracion` int DEFAULT NULL,
  `dosis` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `frecuencia` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dias_medicacion` int DEFAULT NULL,
  `horario` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `indicaciones` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`iddetalle_receta`),
  KEY `fk_detalle_receta` (`receta_idreceta`),
  KEY `fk_detalle_receta_medicamento` (`medicamento_idmedicamento`),
  KEY `fk_detalle_receta_administracion` (`tipo_administracion_idtipo_administracion`),
  CONSTRAINT `fk_detalle_receta` FOREIGN KEY (`receta_idreceta`) REFERENCES `receta` (`idreceta`),
  CONSTRAINT `fk_detalle_receta_administracion` FOREIGN KEY (`tipo_administracion_idtipo_administracion`) REFERENCES `tipo_administracion` (`idtipo_administracion`),
  CONSTRAINT `fk_detalle_receta_medicamento` FOREIGN KEY (`medicamento_idmedicamento`) REFERENCES `medicamento` (`idmedicamento`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_receta`
--

LOCK TABLES `detalle_receta` WRITE;
/*!40000 ALTER TABLE `detalle_receta` DISABLE KEYS */;
INSERT INTO `detalle_receta` VALUES (1,1,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(2,2,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(3,3,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(4,4,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(5,5,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(6,6,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(7,7,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(8,8,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(9,9,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(10,10,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(11,11,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(12,12,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(13,13,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(14,14,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(15,15,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(16,16,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(17,17,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(18,18,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(19,19,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(20,20,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(21,21,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(22,22,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(23,23,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(24,24,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(25,25,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(26,26,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(27,27,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(28,28,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(29,29,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(30,30,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(31,31,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(32,32,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(33,33,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(34,34,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(35,35,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(36,36,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(37,37,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(38,38,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.'),(39,39,1,1,'500 mg','Cada 8 horas',3,'Según indicación','Usar según indicación del personal de salud.'),(40,40,3,1,'1 sobre','Después de cada deposición',3,'Según indicación','Usar según indicación del personal de salud.');
/*!40000 ALTER TABLE `detalle_receta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_tratamiento`
--

DROP TABLE IF EXISTS `detalle_tratamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_tratamiento` (
  `iddetalle_tratamiento` int NOT NULL AUTO_INCREMENT,
  `tratamiento_idtratamiento` int NOT NULL,
  `medicamento_idmedicamento` int NOT NULL,
  `tipo_administracion_idtipo_administracion` int DEFAULT NULL,
  `dosis` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `frecuencia` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duracion_dias` int DEFAULT NULL,
  `horario` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `indicaciones` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`iddetalle_tratamiento`),
  KEY `fk_detalle_tratamiento` (`tratamiento_idtratamiento`),
  KEY `fk_detalle_medicamento` (`medicamento_idmedicamento`),
  KEY `fk_detalle_administracion` (`tipo_administracion_idtipo_administracion`),
  CONSTRAINT `fk_detalle_administracion` FOREIGN KEY (`tipo_administracion_idtipo_administracion`) REFERENCES `tipo_administracion` (`idtipo_administracion`),
  CONSTRAINT `fk_detalle_medicamento` FOREIGN KEY (`medicamento_idmedicamento`) REFERENCES `medicamento` (`idmedicamento`),
  CONSTRAINT `fk_detalle_tratamiento` FOREIGN KEY (`tratamiento_idtratamiento`) REFERENCES `tratamiento` (`idtratamiento`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_tratamiento`
--

LOCK TABLES `detalle_tratamiento` WRITE;
/*!40000 ALTER TABLE `detalle_tratamiento` DISABLE KEYS */;
INSERT INTO `detalle_tratamiento` VALUES (1,1,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(2,2,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(3,3,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(4,4,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(5,5,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(6,6,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(7,7,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(8,8,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(9,9,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(10,10,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(11,11,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(12,12,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(13,13,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(14,14,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(15,15,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(16,16,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(17,17,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(18,18,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(19,19,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(20,20,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(21,21,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(22,22,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(23,23,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(24,24,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(25,25,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(26,26,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(27,27,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(28,28,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.'),(29,29,1,1,'500 mg','Cada 8 horas',3,'Según indicación','No automedicarse.'),(30,30,3,1,'1 sobre','Según deposiciones',3,'Según indicación','No automedicarse.');
/*!40000 ALTER TABLE `detalle_tratamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direccion`
--

DROP TABLE IF EXISTS `direccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direccion` (
  `iddireccion` int NOT NULL AUTO_INCREMENT,
  `nombre_calle` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_calle` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referencia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distrito_iddistrito` int DEFAULT NULL,
  PRIMARY KEY (`iddireccion`),
  KEY `fk_direccion_distrito` (`distrito_iddistrito`),
  CONSTRAINT `fk_direccion_distrito` FOREIGN KEY (`distrito_iddistrito`) REFERENCES `distrito` (`iddistrito`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direccion`
--

LOCK TABLES `direccion` WRITE;
/*!40000 ALTER TABLE `direccion` DISABLE KEYS */;
INSERT INTO `direccion` VALUES (1,'Av. Universitaria','1250','Frente al parque',3),(2,'Av. Próceres de la Independencia','1540','Cerca de la estación',2),(3,'Av. Túpac Amaru','810','Cerca del instituto',1),(4,'Jr. Lima','320','A dos cuadras de la plaza',4),(5,'Jr. 28 de Julio','450','Cerca de la plaza de armas',5),(6,'Av. Ejército','710','Zona residencial',7),(7,'Av. El Sol','560','Cerca del centro histórico',8),(8,'Av. de la Cultura','920','Cerca de la universidad',9),(9,'Av. Ferrocarril','430','Referencia terminal',10),(10,'Av. España','640','Cerca de la plaza',11),(11,'Av. Larco','820','Zona residencial',12),(12,'Av. Grau','560','Cerca del mercado',13),(13,'Av. Sánchez Cerro','740','Zona comercial',14),(14,'Av. Real','950','Cerca del centro',15),(15,'Av. Mariscal Castilla','620','Zona residencial',16),(16,'Jr. Lima','380','Cerca de la plaza',17),(17,'Jr. Dos de Mayo','410','Centro de la ciudad',18),(18,'Av. Balta','725','Cerca del parque principal',19),(19,'Av. Abelardo Quiñones','1100','Cerca del aeropuerto',20),(20,'Av. Arequipa','950','Referencia principal',1);
/*!40000 ALTER TABLE `direccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distrito`
--

DROP TABLE IF EXISTS `distrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distrito` (
  `iddistrito` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provincia_idprovincia` int NOT NULL,
  PRIMARY KEY (`iddistrito`),
  KEY `fk_distrito_provincia` (`provincia_idprovincia`),
  CONSTRAINT `fk_distrito_provincia` FOREIGN KEY (`provincia_idprovincia`) REFERENCES `provincia` (`idprovincia`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distrito`
--

LOCK TABLES `distrito` WRITE;
/*!40000 ALTER TABLE `distrito` DISABLE KEYS */;
INSERT INTO `distrito` VALUES (1,'Lima',1),(2,'San Juan de Lurigancho',1),(3,'Los Olivos',1),(4,'Huaral',2),(5,'Imperial',3),(6,'Arequipa',4),(7,'Cayma',4),(8,'Cusco',5),(9,'San Jerónimo',5),(10,'Urubamba',6),(11,'Trujillo',7),(12,'Víctor Larco Herrera',7),(13,'Piura',8),(14,'Castilla',8),(15,'Huancayo',9),(16,'El Tambo',9),(17,'Puno',10),(18,'Cajamarca',11),(19,'Chiclayo',12),(20,'Iquitos',13);
/*!40000 ALTER TABLE `distrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docente`
--

DROP TABLE IF EXISTS `docente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docente` (
  `iddocente` int NOT NULL AUTO_INCREMENT,
  `especialidad` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_contrato` date DEFAULT NULL,
  `estado_contrato` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `carrera_idcarrera` int NOT NULL,
  `persona_idpersona` int NOT NULL,
  PRIMARY KEY (`iddocente`),
  UNIQUE KEY `uk_docente_persona` (`persona_idpersona`),
  KEY `fk_docente_carrera` (`carrera_idcarrera`),
  CONSTRAINT `fk_docente_carrera` FOREIGN KEY (`carrera_idcarrera`) REFERENCES `carrera` (`idcarrera`),
  CONSTRAINT `fk_docente_persona` FOREIGN KEY (`persona_idpersona`) REFERENCES `persona` (`idpersona`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docente`
--

LOCK TABLES `docente` WRITE;
/*!40000 ALTER TABLE `docente` DISABLE KEYS */;
INSERT INTO `docente` VALUES (1,'Enfermería comunitaria','2023-03-01','ACTIVO',1,43),(2,'Salud pública','2023-03-01','ACTIVO',1,44),(3,'Primeros auxilios','2024-03-01','ACTIVO',1,45),(4,'Cuidados de enfermería','2024-03-01','ACTIVO',1,46),(5,'Redes y comunicaciones','2023-08-01','ACTIVO',2,47),(6,'Administración de servidores','2024-03-01','ACTIVO',2,48),(7,'Servicios cloud','2024-03-01','ACTIVO',2,49),(8,'Ciberseguridad','2025-03-01','ACTIVO',2,50);
/*!40000 ALTER TABLE `docente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enfermedad`
--

DROP TABLE IF EXISTS `enfermedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enfermedad` (
  `idenfermedad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idenfermedad`),
  UNIQUE KEY `uk_enfermedad_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enfermedad`
--

LOCK TABLES `enfermedad` WRITE;
/*!40000 ALTER TABLE `enfermedad` DISABLE KEYS */;
INSERT INTO `enfermedad` VALUES (1,'IRA','Infección Respiratoria Aguda',1),(2,'EDA','Enfermedad Diarreica Aguda',1);
/*!40000 ALTER TABLE `enfermedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiante`
--

DROP TABLE IF EXISTS `estudiante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiante` (
  `idestudiante` int NOT NULL AUTO_INCREMENT,
  `periodo_academico` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `carrera_idcarrera` int NOT NULL,
  `persona_idpersona` int NOT NULL,
  `tipo_apoderado_idtipo_apoderado` int NOT NULL,
  PRIMARY KEY (`idestudiante`),
  UNIQUE KEY `uk_estudiante_persona` (`persona_idpersona`),
  KEY `fk_estudiante_carrera` (`carrera_idcarrera`),
  KEY `fk_estudiante_tipo_apoderado1_idx` (`tipo_apoderado_idtipo_apoderado`),
  CONSTRAINT `fk_estudiante_carrera` FOREIGN KEY (`carrera_idcarrera`) REFERENCES `carrera` (`idcarrera`),
  CONSTRAINT `fk_estudiante_persona` FOREIGN KEY (`persona_idpersona`) REFERENCES `persona` (`idpersona`),
  CONSTRAINT `fk_estudiante_tipo_apoderado1` FOREIGN KEY (`tipo_apoderado_idtipo_apoderado`) REFERENCES `tipo_apoderado` (`idtipo_apoderado`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiante`
--

LOCK TABLES `estudiante` WRITE;
/*!40000 ALTER TABLE `estudiante` DISABLE KEYS */;
INSERT INTO `estudiante` VALUES (1,'2026-I',1,1,1),(2,'2026-I',1,2,2),(3,'2026-I',1,3,3),(4,'2026-I',1,4,1),(5,'2026-I',1,5,2),(6,'2026-I',1,6,3),(7,'2026-I',1,7,1),(8,'2026-I',1,8,2),(9,'2026-I',1,9,3),(10,'2026-I',1,10,1),(11,'2026-I',1,11,2),(12,'2026-I',1,12,3),(13,'2026-I',1,13,1),(14,'2026-I',1,14,2),(15,'2026-I',1,15,3),(16,'2026-I',1,16,1),(17,'2026-I',1,17,2),(18,'2026-I',1,18,3),(19,'2026-I',1,19,1),(20,'2026-I',1,20,2),(21,'2026-I',2,21,3),(22,'2026-I',2,22,1),(23,'2026-I',2,23,2),(24,'2026-I',2,24,3),(25,'2026-I',2,25,1),(26,'2026-I',2,26,2),(27,'2026-I',2,27,3),(28,'2026-I',2,28,1),(29,'2026-I',2,29,2),(30,'2026-I',2,30,3),(31,'2026-I',2,31,1),(32,'2026-I',2,32,2),(33,'2026-I',2,33,3),(34,'2026-I',2,34,1),(35,'2026-I',2,35,2),(36,'2026-I',2,36,3),(37,'2026-I',2,37,1),(38,'2026-I',2,38,2),(39,'2026-I',2,39,3),(40,'2026-I',2,40,1);
/*!40000 ALTER TABLE `estudiante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluacion_clinica`
--

DROP TABLE IF EXISTS `evaluacion_clinica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluacion_clinica` (
  `idevaluacion` int NOT NULL AUTO_INCREMENT,
  `temperatura` decimal(4,1) DEFAULT NULL,
  `frecuencia_cardiaca` int DEFAULT NULL,
  `frecuencia_respiratoria` int DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `talla` decimal(5,2) DEFAULT NULL,
  `saturacion_oxigeno` decimal(5,2) DEFAULT NULL,
  `estado_general` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `atencion_idatencion` int NOT NULL,
  PRIMARY KEY (`idevaluacion`),
  UNIQUE KEY `uk_evaluacion_atencion` (`atencion_idatencion`),
  CONSTRAINT `fk_evaluacion_atencion` FOREIGN KEY (`atencion_idatencion`) REFERENCES `atencion` (`idatencion`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluacion_clinica`
--

LOCK TABLES `evaluacion_clinica` WRITE;
/*!40000 ALTER TABLE `evaluacion_clinica` DISABLE KEYS */;
INSERT INTO `evaluacion_clinica` VALUES (1,36.6,71,17,55.70,1.56,97.00,'Estable','Evaluación inicial registrada.',1),(2,36.7,72,18,56.40,1.57,98.00,'Estable','Evaluación inicial registrada.',2),(3,36.8,73,19,57.10,1.58,99.00,'Estable','Evaluación inicial registrada.',3),(4,36.9,74,20,57.80,1.59,96.00,'Estable','Evaluación inicial registrada.',4),(5,37.0,75,21,58.50,1.60,97.00,'Estable','Evaluación inicial registrada.',5),(6,36.5,76,22,59.20,1.61,98.00,'Estable','Evaluación inicial registrada.',6),(7,36.6,77,23,59.90,1.62,99.00,'Regular','Evaluación inicial registrada.',7),(8,36.7,78,16,60.60,1.63,96.00,'Estable','Evaluación inicial registrada.',8),(9,36.8,79,17,61.30,1.64,97.00,'Estable','Evaluación inicial registrada.',9),(10,36.9,80,18,62.00,1.65,98.00,'Estable','Evaluación inicial registrada.',10),(11,37.0,81,19,62.70,1.66,99.00,'Estable','Evaluación inicial registrada.',11),(12,36.5,82,20,63.40,1.67,96.00,'Estable','Evaluación inicial registrada.',12),(13,36.6,83,21,64.10,1.68,97.00,'Estable','Evaluación inicial registrada.',13),(14,36.7,84,22,64.80,1.69,98.00,'Regular','Evaluación inicial registrada.',14),(15,36.8,85,23,65.50,1.70,99.00,'Estable','Evaluación inicial registrada.',15),(16,36.9,86,16,66.20,1.71,96.00,'Estable','Evaluación inicial registrada.',16),(17,37.0,87,17,66.90,1.72,97.00,'Estable','Evaluación inicial registrada.',17),(18,36.5,88,18,67.60,1.73,98.00,'Estable','Evaluación inicial registrada.',18),(19,36.6,89,19,68.30,1.74,99.00,'Estable','Evaluación inicial registrada.',19),(20,36.7,70,20,69.00,1.55,96.00,'Estable','Evaluación inicial registrada.',20),(21,36.8,71,21,69.70,1.56,97.00,'Regular','Evaluación inicial registrada.',21),(22,36.9,72,22,70.40,1.57,98.00,'Estable','Evaluación inicial registrada.',22),(23,37.0,73,23,71.10,1.58,99.00,'Estable','Evaluación inicial registrada.',23),(24,36.5,74,16,71.80,1.59,96.00,'Estable','Evaluación inicial registrada.',24),(25,36.6,75,17,55.00,1.60,97.00,'Estable','Evaluación inicial registrada.',25),(26,36.7,76,18,55.70,1.61,98.00,'Estable','Evaluación inicial registrada.',26),(27,36.8,77,19,56.40,1.62,99.00,'Estable','Evaluación inicial registrada.',27),(28,36.9,78,20,57.10,1.63,96.00,'Regular','Evaluación inicial registrada.',28),(29,37.0,79,21,57.80,1.64,97.00,'Estable','Evaluación inicial registrada.',29),(30,36.5,80,22,58.50,1.65,98.00,'Estable','Evaluación inicial registrada.',30),(31,36.6,81,23,59.20,1.66,99.00,'Estable','Evaluación inicial registrada.',31),(32,36.7,82,16,59.90,1.67,96.00,'Estable','Evaluación inicial registrada.',32),(33,36.8,83,17,60.60,1.68,97.00,'Estable','Evaluación inicial registrada.',33),(34,36.9,84,18,61.30,1.69,98.00,'Estable','Evaluación inicial registrada.',34),(35,37.0,85,19,62.00,1.70,99.00,'Regular','Evaluación inicial registrada.',35),(36,36.5,86,20,62.70,1.71,96.00,'Estable','Evaluación inicial registrada.',36),(37,36.6,87,21,63.40,1.72,97.00,'Estable','Evaluación inicial registrada.',37),(38,36.7,88,22,64.10,1.73,98.00,'Estable','Evaluación inicial registrada.',38),(39,36.8,89,23,64.80,1.74,99.00,'Estable','Evaluación inicial registrada.',39),(40,36.9,70,16,65.50,1.55,96.00,'Estable','Evaluación inicial registrada.',40),(41,37.0,71,17,66.20,1.56,97.00,'Estable','Evaluación inicial registrada.',41),(42,36.5,72,18,66.90,1.57,98.00,'Regular','Evaluación inicial registrada.',42),(43,36.6,73,19,67.60,1.58,99.00,'Estable','Evaluación inicial registrada.',43),(44,36.7,74,20,68.30,1.59,96.00,'Estable','Evaluación inicial registrada.',44),(45,36.8,75,21,69.00,1.60,97.00,'Estable','Evaluación inicial registrada.',45),(46,36.9,76,22,69.70,1.61,98.00,'Estable','Evaluación inicial registrada.',46),(47,37.0,77,23,70.40,1.62,99.00,'Estable','Evaluación inicial registrada.',47),(48,36.5,78,16,71.10,1.63,96.00,'Estable','Evaluación inicial registrada.',48),(49,36.6,79,17,71.80,1.64,97.00,'Regular','Evaluación inicial registrada.',49),(50,36.7,80,18,55.00,1.65,98.00,'Estable','Evaluación inicial registrada.',50),(51,36.8,81,19,55.70,1.66,99.00,'Estable','Evaluación inicial registrada.',51),(52,36.9,82,20,56.40,1.67,96.00,'Estable','Evaluación inicial registrada.',52),(53,37.0,83,21,57.10,1.68,97.00,'Estable','Evaluación inicial registrada.',53),(54,36.5,84,22,57.80,1.69,98.00,'Estable','Evaluación inicial registrada.',54),(55,36.6,85,23,58.50,1.70,99.00,'Estable','Evaluación inicial registrada.',55),(56,36.7,86,16,59.20,1.71,96.00,'Regular','Evaluación inicial registrada.',56),(57,36.8,87,17,59.90,1.72,97.00,'Estable','Evaluación inicial registrada.',57),(58,36.9,88,18,60.60,1.73,98.00,'Estable','Evaluación inicial registrada.',58),(59,37.0,89,19,61.30,1.74,99.00,'Estable','Evaluación inicial registrada.',59),(60,36.5,70,20,62.00,1.55,96.00,'Estable','Evaluación inicial registrada.',60);
/*!40000 ALTER TABLE `evaluacion_clinica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historia_clinica`
--

DROP TABLE IF EXISTS `historia_clinica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historia_clinica` (
  `idhistoria_clinica` int NOT NULL AUTO_INCREMENT,
  `numero_historia_clinica` int NOT NULL,
  `fecha_apertura` date NOT NULL,
  `estado` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVA',
  `persona_idpersona` int NOT NULL,
  PRIMARY KEY (`idhistoria_clinica`),
  UNIQUE KEY `uk_historia_numero` (`numero_historia_clinica`),
  UNIQUE KEY `uk_historia_persona` (`persona_idpersona`),
  CONSTRAINT `fk_historia_persona` FOREIGN KEY (`persona_idpersona`) REFERENCES `persona` (`idpersona`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historia_clinica`
--

LOCK TABLES `historia_clinica` WRITE;
/*!40000 ALTER TABLE `historia_clinica` DISABLE KEYS */;
INSERT INTO `historia_clinica` VALUES (1,1001,'2026-01-01','ACTIVA',1),(2,1002,'2026-01-02','ACTIVA',2),(3,1003,'2026-01-03','ACTIVA',3),(4,1004,'2026-01-04','ACTIVA',4),(5,1005,'2026-01-05','ACTIVA',5),(6,1006,'2026-01-06','ACTIVA',6),(7,1007,'2026-01-07','ACTIVA',7),(8,1008,'2026-01-08','ACTIVA',8),(9,1009,'2026-01-09','ACTIVA',9),(10,1010,'2026-01-10','ACTIVA',10),(11,1011,'2026-01-11','ACTIVA',11),(12,1012,'2026-01-12','ACTIVA',12),(13,1013,'2026-01-13','ACTIVA',13),(14,1014,'2026-01-14','ACTIVA',14),(15,1015,'2026-01-15','ACTIVA',15),(16,1016,'2026-01-16','ACTIVA',16),(17,1017,'2026-01-17','ACTIVA',17),(18,1018,'2026-01-18','ACTIVA',18),(19,1019,'2026-01-19','ACTIVA',19),(20,1020,'2026-01-20','ACTIVA',20),(21,1021,'2026-01-21','ACTIVA',21),(22,1022,'2026-01-22','ACTIVA',22),(23,1023,'2026-01-23','ACTIVA',23),(24,1024,'2026-01-24','ACTIVA',24),(25,1025,'2026-01-25','ACTIVA',25),(26,1026,'2026-01-26','ACTIVA',26),(27,1027,'2026-01-27','ACTIVA',27),(28,1028,'2026-01-28','ACTIVA',28),(29,1029,'2026-01-01','ACTIVA',29),(30,1030,'2026-01-02','ACTIVA',30),(31,1031,'2026-01-03','ACTIVA',31),(32,1032,'2026-01-04','ACTIVA',32),(33,1033,'2026-01-05','ACTIVA',33),(34,1034,'2026-01-06','ACTIVA',34),(35,1035,'2026-01-07','ACTIVA',35),(36,1036,'2026-01-08','ACTIVA',36),(37,1037,'2026-01-09','ACTIVA',37),(38,1038,'2026-01-10','ACTIVA',38),(39,1039,'2026-01-11','ACTIVA',39),(40,1040,'2026-01-12','ACTIVA',40),(41,1041,'2026-01-13','ACTIVA',41),(42,1042,'2026-01-14','ACTIVA',42),(43,1043,'2026-01-15','ACTIVA',43),(44,1044,'2026-01-16','ACTIVA',44),(45,1045,'2026-01-17','ACTIVA',45),(46,1046,'2026-01-18','ACTIVA',46),(47,1047,'2026-01-19','ACTIVA',47),(48,1048,'2026-01-20','ACTIVA',48),(49,1049,'2026-01-21','ACTIVA',49),(50,1050,'2026-01-22','ACTIVA',50),(51,1051,'2026-01-23','ACTIVA',51),(52,1052,'2026-01-24','ACTIVA',52),(53,1053,'2026-01-25','ACTIVA',53),(54,1054,'2026-01-26','ACTIVA',54),(55,1055,'2026-01-27','ACTIVA',55),(56,1056,'2026-01-28','ACTIVA',56),(57,1057,'2026-01-01','ACTIVA',57),(58,1058,'2026-01-02','ACTIVA',58),(59,1059,'2026-01-03','ACTIVA',59),(60,1060,'2026-01-04','ACTIVA',60);
/*!40000 ALTER TABLE `historia_clinica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horario_topico`
--

DROP TABLE IF EXISTS `horario_topico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horario_topico` (
  `idhorario` int NOT NULL AUTO_INCREMENT,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `turno` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dia_semana` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `usuario_idusuario` int NOT NULL,
  PRIMARY KEY (`idhorario`),
  KEY `fk_horario_topico_usuario1_idx` (`usuario_idusuario`),
  CONSTRAINT `fk_horario_topico_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horario_topico`
--

LOCK TABLES `horario_topico` WRITE;
/*!40000 ALTER TABLE `horario_topico` DISABLE KEYS */;
INSERT INTO `horario_topico` VALUES (1,'08:00:00','10:00:00','Mañana','Lunes',1,1),(2,'10:00:00','12:00:00','Mañana','Lunes',1,2),(3,'14:00:00','16:00:00','Tarde','Lunes',1,3),(4,'16:00:00','18:00:00','Tarde','Lunes',1,4),(5,'08:00:00','10:00:00','Mañana','Martes',1,5),(6,'10:00:00','12:00:00','Mañana','Martes',1,6),(7,'14:00:00','16:00:00','Tarde','Martes',1,7),(8,'16:00:00','18:00:00','Tarde','Martes',1,8),(9,'08:00:00','10:00:00','Mañana','Miércoles',1,1),(10,'10:00:00','12:00:00','Mañana','Miércoles',1,2),(11,'14:00:00','16:00:00','Tarde','Miércoles',1,3),(12,'16:00:00','18:00:00','Tarde','Miércoles',1,4),(13,'08:00:00','10:00:00','Mañana','Jueves',1,5),(14,'10:00:00','12:00:00','Mañana','Jueves',1,6),(15,'14:00:00','16:00:00','Tarde','Jueves',1,7),(16,'16:00:00','18:00:00','Tarde','Jueves',1,8);
/*!40000 ALTER TABLE `horario_topico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicamento`
--

DROP TABLE IF EXISTS `medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicamento` (
  `idmedicamento` int NOT NULL AUTO_INCREMENT,
  `nombre_medicamento` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idmedicamento`),
  UNIQUE KEY `uk_medicamento_nombre` (`nombre_medicamento`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicamento`
--

LOCK TABLES `medicamento` WRITE;
/*!40000 ALTER TABLE `medicamento` DISABLE KEYS */;
INSERT INTO `medicamento` VALUES (1,'Paracetamol 500 mg',1),(2,'Ibuprofeno 400 mg',1),(3,'Sales de rehidratación oral',1),(4,'Zinc 20 mg',1),(5,'Ambroxol',1),(6,'Salbutamol inhalador',1),(7,'Suero oral',1),(8,'Loratadina 10 mg',1);
/*!40000 ALTER TABLE `medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pais`
--

DROP TABLE IF EXISTS `pais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pais` (
  `idpais` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`idpais`),
  UNIQUE KEY `uk_pais_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pais`
--

LOCK TABLES `pais` WRITE;
/*!40000 ALTER TABLE `pais` DISABLE KEYS */;
INSERT INTO `pais` VALUES (1,'Perú');
/*!40000 ALTER TABLE `pais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `idpersona` int NOT NULL AUTO_INCREMENT,
  `dni` char(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombres` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido_paterno` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido_materno` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `etnia` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion_iddireccion` int DEFAULT NULL,
  PRIMARY KEY (`idpersona`),
  UNIQUE KEY `uk_persona_dni` (`dni`),
  KEY `fk_persona_direccion` (`direccion_iddireccion`),
  CONSTRAINT `fk_persona_direccion` FOREIGN KEY (`direccion_iddireccion`) REFERENCES `direccion` (`iddireccion`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (1,'70000001','Ana','García','Cruz','910000001','ana.garcía1@instituto.edu.pe','1997-06-12','Femenino','Quechua',1),(2,'70000002','Luis','Flores','Chávez','910000002','luis.flores2@instituto.edu.pe','2004-11-23','Masculino','Aimara',2),(3,'70000003','María','Quispe','Paredes','910000003','maría.quispe3@instituto.edu.pe','1991-04-07','Femenino','Mestizo',3),(4,'70000004','José','Torres','Sánchez','910000004','josé.torres4@instituto.edu.pe','1998-09-18','Masculino','Mestiza',4),(5,'70000005','Carlos','Ramírez','Morales','910000005','carlos.ramírez5@instituto.edu.pe','2005-02-02','Femenino','Quechua',5),(6,'70000006','Rosa','Huamán','Salazar','910000006','rosa.huamán6@instituto.edu.pe','1992-07-13','Masculino','Aimara',6),(7,'70000007','Jorge','Rojas','Pérez','910000007','jorge.rojas7@instituto.edu.pe','1999-12-24','Femenino','Mestizo',7),(8,'70000008','Lucía','Mendoza','Díaz','910000008','lucía.mendoza8@instituto.edu.pe','2006-05-08','Masculino','Mestiza',8),(9,'70000009','Miguel','Castillo','Condori','910000009','miguel.castillo9@instituto.edu.pe','1993-10-19','Femenino','Quechua',9),(10,'70000010','Carmen','Vargas','Valdez','910000010','carmen.vargas10@instituto.edu.pe','2000-03-03','Masculino','Aimara',10),(11,'70000011','Diego','García','Cruz','910000011','diego.garcía11@instituto.edu.pe','2007-08-14','Femenino','Mestizo',11),(12,'70000012','Sofía','Flores','Chávez','910000012','sofía.flores12@instituto.edu.pe','1994-01-25','Masculino','Mestiza',12),(13,'70000013','Pedro','Quispe','Paredes','910000013','pedro.quispe13@instituto.edu.pe','2001-06-09','Femenino','Quechua',13),(14,'70000014','Valeria','Torres','Sánchez','910000014','valeria.torres14@instituto.edu.pe','2008-11-20','Masculino','Aimara',14),(15,'70000015','Juan','Ramírez','Morales','910000015','juan.ramírez15@instituto.edu.pe','1995-04-04','Femenino','Mestizo',15),(16,'70000016','Daniela','Huamán','Salazar','910000016','daniela.huamán16@instituto.edu.pe','2002-09-15','Masculino','Mestiza',16),(17,'70000017','Fernando','Rojas','Pérez','910000017','fernando.rojas17@instituto.edu.pe','2009-02-26','Femenino','Quechua',1),(18,'70000018','Gabriela','Mendoza','Díaz','910000018','gabriela.mendoza18@instituto.edu.pe','1996-07-10','Masculino','Aimara',2),(19,'70000019','Ricardo','Castillo','Condori','910000019','ricardo.castillo19@instituto.edu.pe','2003-12-21','Femenino','Mestizo',3),(20,'70000020','Andrea','Vargas','Valdez','910000020','andrea.vargas20@instituto.edu.pe','1990-05-05','Masculino','Mestiza',4),(21,'70000021','Alonso','García','Cruz','910000021','alonso.garcía21@instituto.edu.pe','1997-10-16','Femenino','Quechua',5),(22,'70000022','Camila','Flores','Chávez','910000022','camila.flores22@instituto.edu.pe','2004-03-27','Masculino','Aimara',6),(23,'70000023','Bruno','Quispe','Paredes','910000023','bruno.quispe23@instituto.edu.pe','1991-08-11','Femenino','Mestizo',7),(24,'70000024','Paola','Torres','Sánchez','910000024','paola.torres24@instituto.edu.pe','1998-01-22','Masculino','Mestiza',8),(25,'70000025','Marco','Ramírez','Morales','910000025','marco.ramírez25@instituto.edu.pe','2005-06-06','Femenino','Quechua',9),(26,'70000026','Fiorella','Huamán','Salazar','910000026','fiorella.huamán26@instituto.edu.pe','1992-11-17','Masculino','Aimara',10),(27,'70000027','Renato','Rojas','Pérez','910000027','renato.rojas27@instituto.edu.pe','1999-04-01','Femenino','Mestizo',11),(28,'70000028','Diana','Mendoza','Díaz','910000028','diana.mendoza28@instituto.edu.pe','2006-09-12','Masculino','Mestiza',12),(29,'70000029','Sebastián','Castillo','Condori','910000029','sebastián.castillo29@instituto.edu.pe','1993-02-23','Femenino','Quechua',13),(30,'70000030','Natalia','Vargas','Valdez','910000030','natalia.vargas30@instituto.edu.pe','2000-07-07','Masculino','Aimara',14),(31,'70000031','Kevin','García','Cruz','910000031','kevin.garcía31@instituto.edu.pe','2007-12-18','Femenino','Mestizo',15),(32,'70000032','Patricia','Flores','Chávez','910000032','patricia.flores32@instituto.edu.pe','1994-05-02','Masculino','Mestiza',16),(33,'70000033','Christian','Quispe','Paredes','910000033','christian.quispe33@instituto.edu.pe','2001-10-13','Femenino','Quechua',1),(34,'70000034','Mónica','Torres','Sánchez','910000034','mónica.torres34@instituto.edu.pe','2008-03-24','Masculino','Aimara',2),(35,'70000035','Álvaro','Ramírez','Morales','910000035','álvaro.ramírez35@instituto.edu.pe','1995-08-08','Femenino','Mestizo',3),(36,'70000036','Karina','Huamán','Salazar','910000036','karina.huamán36@instituto.edu.pe','2002-01-19','Masculino','Mestiza',4),(37,'70000037','Eduardo','Rojas','Pérez','910000037','eduardo.rojas37@instituto.edu.pe','2009-06-03','Femenino','Quechua',5),(38,'70000038','Leslie','Mendoza','Díaz','910000038','leslie.mendoza38@instituto.edu.pe','1996-11-14','Masculino','Aimara',6),(39,'70000039','Hugo','Castillo','Condori','910000039','hugo.castillo39@instituto.edu.pe','2003-04-25','Femenino','Mestizo',7),(40,'70000040','Milagros','Vargas','Valdez','910000040','milagros.vargas40@instituto.edu.pe','1990-09-09','Masculino','Mestiza',8),(41,'70000041','Franco','García','Cruz','910000041','franco.garcía41@instituto.edu.pe','1997-02-20','Femenino','Quechua',9),(42,'70000042','Jimena','Flores','Chávez','910000042','jimena.flores42@instituto.edu.pe','2004-07-04','Masculino','Aimara',10),(43,'70000043','Víctor','Quispe','Paredes','910000043','víctor.quispe43@instituto.edu.pe','1991-12-15','Femenino','Mestizo',11),(44,'70000044','Claudia','Torres','Sánchez','910000044','claudia.torres44@instituto.edu.pe','1998-05-26','Masculino','Mestiza',12),(45,'70000045','Andrés','Ramírez','Morales','910000045','andrés.ramírez45@instituto.edu.pe','2005-10-10','Femenino','Quechua',13),(46,'70000046','Elena','Huamán','Salazar','910000046','elena.huamán46@instituto.edu.pe','1992-03-21','Masculino','Aimara',14),(47,'70000047','Raúl','Rojas','Pérez','910000047','raúl.rojas47@instituto.edu.pe','1999-08-05','Femenino','Mestizo',15),(48,'70000048','Silvia','Mendoza','Díaz','910000048','silvia.mendoza48@instituto.edu.pe','2006-01-16','Masculino','Mestiza',16),(49,'70000049','Gianfranco','Castillo','Condori','910000049','gianfranco.castillo49@instituto.edu.pe','1993-06-27','Femenino','Quechua',1),(50,'70000050','Marisol','Vargas','Valdez','910000050','marisol.vargas50@instituto.edu.pe','2000-11-11','Masculino','Aimara',2),(51,'70000051','Piero','García','Cruz','910000051','piero.garcía51@instituto.edu.pe','2007-04-22','Femenino','Mestizo',3),(52,'70000052','Noelia','Flores','Chávez','910000052','noelia.flores52@instituto.edu.pe','1994-09-06','Masculino','Mestiza',4),(53,'70000053','César','Quispe','Paredes','910000053','césar.quispe53@instituto.edu.pe','2001-02-17','Femenino','Quechua',5),(54,'70000054','Tatiana','Torres','Sánchez','910000054','tatiana.torres54@instituto.edu.pe','2008-07-01','Masculino','Aimara',6),(55,'70000055','Javier','Ramírez','Morales','910000055','javier.ramírez55@instituto.edu.pe','1995-12-12','Femenino','Mestizo',7),(56,'70000056','Rocío','Huamán','Salazar','910000056','rocío.huamán56@instituto.edu.pe','2002-05-23','Masculino','Mestiza',8),(57,'70000057','Martín','Rojas','Pérez','910000057','martín.rojas57@instituto.edu.pe','2009-10-07','Femenino','Quechua',9),(58,'70000058','Adriana','Mendoza','Díaz','910000058','adriana.mendoza58@instituto.edu.pe','1996-03-18','Masculino','Aimara',10),(59,'70000059','Walter','Castillo','Condori','910000059','walter.castillo59@instituto.edu.pe','2003-08-02','Femenino','Mestizo',11),(60,'70000060','Fátima','Vargas','Valdez','910000060','fátima.vargas60@instituto.edu.pe','1990-01-13','Masculino','Mestiza',12);
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provincia`
--

DROP TABLE IF EXISTS `provincia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provincia` (
  `idprovincia` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departamento_iddepartamento` int NOT NULL,
  PRIMARY KEY (`idprovincia`),
  KEY `fk_provincia_departamento` (`departamento_iddepartamento`),
  CONSTRAINT `fk_provincia_departamento` FOREIGN KEY (`departamento_iddepartamento`) REFERENCES `departamento` (`iddepartamento`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provincia`
--

LOCK TABLES `provincia` WRITE;
/*!40000 ALTER TABLE `provincia` DISABLE KEYS */;
INSERT INTO `provincia` VALUES (1,'Lima',1),(2,'Huaral',1),(3,'Cañete',1),(4,'Arequipa',2),(5,'Cusco',3),(6,'Urubamba',3),(7,'Trujillo',4),(8,'Piura',5),(9,'Huancayo',6),(10,'Puno',7),(11,'Cajamarca',8),(12,'Chiclayo',9),(13,'Maynas',10);
/*!40000 ALTER TABLE `provincia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receta`
--

DROP TABLE IF EXISTS `receta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receta` (
  `idreceta` int NOT NULL AUTO_INCREMENT,
  `codigo_receta` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_receta` date NOT NULL,
  `indicaciones_generales` text COLLATE utf8mb4_unicode_ci,
  `atencion_idatencion` int NOT NULL,
  PRIMARY KEY (`idreceta`),
  UNIQUE KEY `uk_receta_codigo` (`codigo_receta`),
  KEY `fk_receta_atencion` (`atencion_idatencion`),
  CONSTRAINT `fk_receta_atencion` FOREIGN KEY (`atencion_idatencion`) REFERENCES `atencion` (`idatencion`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receta`
--

LOCK TABLES `receta` WRITE;
/*!40000 ALTER TABLE `receta` DISABLE KEYS */;
INSERT INTO `receta` VALUES (1,'REC-0001','2026-02-01','Cumplir las indicaciones y acudir si aparecen signos de alarma.',1),(2,'REC-0002','2026-02-02','Cumplir las indicaciones y acudir si aparecen signos de alarma.',2),(3,'REC-0003','2026-02-03','Cumplir las indicaciones y acudir si aparecen signos de alarma.',3),(4,'REC-0004','2026-02-04','Cumplir las indicaciones y acudir si aparecen signos de alarma.',4),(5,'REC-0005','2026-02-05','Cumplir las indicaciones y acudir si aparecen signos de alarma.',5),(6,'REC-0006','2026-02-06','Cumplir las indicaciones y acudir si aparecen signos de alarma.',6),(7,'REC-0007','2026-02-07','Cumplir las indicaciones y acudir si aparecen signos de alarma.',7),(8,'REC-0008','2026-02-08','Cumplir las indicaciones y acudir si aparecen signos de alarma.',8),(9,'REC-0009','2026-02-09','Cumplir las indicaciones y acudir si aparecen signos de alarma.',9),(10,'REC-0010','2026-02-10','Cumplir las indicaciones y acudir si aparecen signos de alarma.',10),(11,'REC-0011','2026-02-11','Cumplir las indicaciones y acudir si aparecen signos de alarma.',11),(12,'REC-0012','2026-02-12','Cumplir las indicaciones y acudir si aparecen signos de alarma.',12),(13,'REC-0013','2026-02-13','Cumplir las indicaciones y acudir si aparecen signos de alarma.',13),(14,'REC-0014','2026-02-14','Cumplir las indicaciones y acudir si aparecen signos de alarma.',14),(15,'REC-0015','2026-02-15','Cumplir las indicaciones y acudir si aparecen signos de alarma.',15),(16,'REC-0016','2026-02-16','Cumplir las indicaciones y acudir si aparecen signos de alarma.',16),(17,'REC-0017','2026-02-17','Cumplir las indicaciones y acudir si aparecen signos de alarma.',17),(18,'REC-0018','2026-02-18','Cumplir las indicaciones y acudir si aparecen signos de alarma.',18),(19,'REC-0019','2026-02-19','Cumplir las indicaciones y acudir si aparecen signos de alarma.',19),(20,'REC-0020','2026-02-20','Cumplir las indicaciones y acudir si aparecen signos de alarma.',20),(21,'REC-0021','2026-02-21','Cumplir las indicaciones y acudir si aparecen signos de alarma.',21),(22,'REC-0022','2026-02-22','Cumplir las indicaciones y acudir si aparecen signos de alarma.',22),(23,'REC-0023','2026-02-23','Cumplir las indicaciones y acudir si aparecen signos de alarma.',23),(24,'REC-0024','2026-02-24','Cumplir las indicaciones y acudir si aparecen signos de alarma.',24),(25,'REC-0025','2026-02-25','Cumplir las indicaciones y acudir si aparecen signos de alarma.',25),(26,'REC-0026','2026-02-26','Cumplir las indicaciones y acudir si aparecen signos de alarma.',26),(27,'REC-0027','2026-02-27','Cumplir las indicaciones y acudir si aparecen signos de alarma.',27),(28,'REC-0028','2026-02-28','Cumplir las indicaciones y acudir si aparecen signos de alarma.',28),(29,'REC-0029','2026-02-01','Cumplir las indicaciones y acudir si aparecen signos de alarma.',29),(30,'REC-0030','2026-02-02','Cumplir las indicaciones y acudir si aparecen signos de alarma.',30),(31,'REC-0031','2026-02-03','Cumplir las indicaciones y acudir si aparecen signos de alarma.',31),(32,'REC-0032','2026-02-04','Cumplir las indicaciones y acudir si aparecen signos de alarma.',32),(33,'REC-0033','2026-02-05','Cumplir las indicaciones y acudir si aparecen signos de alarma.',33),(34,'REC-0034','2026-02-06','Cumplir las indicaciones y acudir si aparecen signos de alarma.',34),(35,'REC-0035','2026-02-07','Cumplir las indicaciones y acudir si aparecen signos de alarma.',35),(36,'REC-0036','2026-02-08','Cumplir las indicaciones y acudir si aparecen signos de alarma.',36),(37,'REC-0037','2026-02-09','Cumplir las indicaciones y acudir si aparecen signos de alarma.',37),(38,'REC-0038','2026-02-10','Cumplir las indicaciones y acudir si aparecen signos de alarma.',38),(39,'REC-0039','2026-02-11','Cumplir las indicaciones y acudir si aparecen signos de alarma.',39),(40,'REC-0040','2026-02-12','Cumplir las indicaciones y acudir si aparecen signos de alarma.',40);
/*!40000 ALTER TABLE `receta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sintoma`
--

DROP TABLE IF EXISTS `sintoma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sintoma` (
  `idsintoma` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idsintoma`),
  UNIQUE KEY `uk_sintoma_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sintoma`
--

LOCK TABLES `sintoma` WRITE;
/*!40000 ALTER TABLE `sintoma` DISABLE KEYS */;
INSERT INTO `sintoma` VALUES (1,'Fiebre','Elevación de la temperatura corporal',1),(2,'Tos','Tos de diferente intensidad',1),(3,'Dolor de garganta','Molestia o dolor faríngeo',1),(4,'Congestión nasal','Obstrucción nasal',1),(5,'Diarrea','Evacuaciones líquidas o frecuentes',1),(6,'Dolor abdominal','Dolor o molestia abdominal',1),(7,'Vómitos','Expulsión del contenido gástrico',1),(8,'Sed','Sensación aumentada de sed',1),(9,'Sibilancias','Ruido respiratorio agudo',1),(10,'Malestar general','Sensación general de indisposición',1);
/*!40000 ALTER TABLE `sintoma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_administracion`
--

DROP TABLE IF EXISTS `tipo_administracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_administracion` (
  `idtipo_administracion` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idtipo_administracion`),
  UNIQUE KEY `uk_tipo_administracion_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_administracion`
--

LOCK TABLES `tipo_administracion` WRITE;
/*!40000 ALTER TABLE `tipo_administracion` DISABLE KEYS */;
INSERT INTO `tipo_administracion` VALUES (1,'Oral',1),(2,'Tópica',1),(3,'Inhalatoria',1),(4,'Intramuscular',1);
/*!40000 ALTER TABLE `tipo_administracion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_apoderado`
--

DROP TABLE IF EXISTS `tipo_apoderado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_apoderado` (
  `idtipo_apoderado` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  PRIMARY KEY (`idtipo_apoderado`),
  UNIQUE KEY `uk_tipo_apoderado_nombre` (`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_apoderado`
--

LOCK TABLES `tipo_apoderado` WRITE;
/*!40000 ALTER TABLE `tipo_apoderado` DISABLE KEYS */;
INSERT INTO `tipo_apoderado` VALUES (1,'Padre','1'),(2,'Madre','1'),(3,'Apoderado legal','1');
/*!40000 ALTER TABLE `tipo_apoderado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_atencion`
--

DROP TABLE IF EXISTS `tipo_atencion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_atencion` (
  `idtipo_atencion` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idtipo_atencion`),
  UNIQUE KEY `uk_tipo_atencion_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_atencion`
--

LOCK TABLES `tipo_atencion` WRITE;
/*!40000 ALTER TABLE `tipo_atencion` DISABLE KEYS */;
INSERT INTO `tipo_atencion` VALUES (1,'IRA','Infección Respiratoria Aguda',1),(2,'EDA','Enfermedad Diarreica Aguda',1),(3,'Control','Control y seguimiento general',1);
/*!40000 ALTER TABLE `tipo_atencion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_tratamiento`
--

DROP TABLE IF EXISTS `tipo_tratamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_tratamiento` (
  `idtipo_tratamiento` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idtipo_tratamiento`),
  UNIQUE KEY `uk_tipo_tratamiento_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_tratamiento`
--

LOCK TABLES `tipo_tratamiento` WRITE;
/*!40000 ALTER TABLE `tipo_tratamiento` DISABLE KEYS */;
INSERT INTO `tipo_tratamiento` VALUES (1,'Hidratación','Reposición y mantenimiento de líquidos.',1),(2,'Sintomático','Manejo de signos y síntomas.',1),(3,'Respiratorio','Medidas orientadas a síntomas respiratorios.',1),(4,'Educativo','Orientación para el cuidado en casa.',1);
/*!40000 ALTER TABLE `tipo_tratamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tratamiento`
--

DROP TABLE IF EXISTS `tratamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tratamiento` (
  `idtratamiento` int NOT NULL AUTO_INCREMENT,
  `tipo_tratamiento_idtipo_tratamiento` int NOT NULL,
  `atencion_idatencion` int NOT NULL,
  `indicaciones` text COLLATE utf8mb4_unicode_ci,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`idtratamiento`),
  KEY `fk_tratamiento_tipo` (`tipo_tratamiento_idtipo_tratamiento`),
  KEY `fk_tratamiento_atencion` (`atencion_idatencion`),
  CONSTRAINT `fk_tratamiento_atencion` FOREIGN KEY (`atencion_idatencion`) REFERENCES `atencion` (`idatencion`),
  CONSTRAINT `fk_tratamiento_tipo` FOREIGN KEY (`tipo_tratamiento_idtipo_tratamiento`) REFERENCES `tipo_tratamiento` (`idtipo_tratamiento`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tratamiento`
--

LOCK TABLES `tratamiento` WRITE;
/*!40000 ALTER TABLE `tratamiento` DISABLE KEYS */;
INSERT INTO `tratamiento` VALUES (1,3,1,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(2,1,2,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(3,3,3,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(4,1,4,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(5,3,5,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(6,1,6,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(7,3,7,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(8,1,8,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(9,3,9,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(10,1,10,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(11,3,11,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(12,1,12,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(13,3,13,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(14,1,14,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(15,3,15,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(16,1,16,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(17,3,17,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(18,1,18,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(19,3,19,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(20,1,20,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(21,3,21,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(22,1,22,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(23,3,23,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(24,1,24,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(25,3,25,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(26,1,26,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(27,3,27,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(28,1,28,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(29,3,29,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.'),(30,1,30,'Reposo relativo, hidratación y seguimiento según evolución.','Registrar evolución en la próxima atención.');
/*!40000 ALTER TABLE `tratamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idusuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `docente_iddocente` int NOT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE KEY `uk_usuario_nombre` (`nombre_usuario`),
  UNIQUE KEY `uk_usuario_docente` (`docente_iddocente`),
  CONSTRAINT `fk_usuario_docente` FOREIGN KEY (`docente_iddocente`) REFERENCES `docente` (`iddocente`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'docente01','HASH_DE_PRUEBA_01',1,1),(2,'docente02','HASH_DE_PRUEBA_02',1,2),(3,'docente03','HASH_DE_PRUEBA_03',1,3),(4,'docente04','HASH_DE_PRUEBA_04',1,4),(5,'docente05','HASH_DE_PRUEBA_05',1,5),(6,'docente06','HASH_DE_PRUEBA_06',1,6),(7,'docente07','HASH_DE_PRUEBA_07',1,7),(8,'docente08','HASH_DE_PRUEBA_08',1,8);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'bd_topico_instituto'
--

--
-- Dumping routines for database 'bd_topico_instituto'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-16 14:37:03