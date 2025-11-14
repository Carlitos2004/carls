-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: inventario_automotriz
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `movimientos`
--

DROP TABLE IF EXISTS `movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `cantidad` int NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos`
--

LOCK TABLES `movimientos` WRITE;
/*!40000 ALTER TABLE `movimientos` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(255) NOT NULL,
  `etiqueta` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'HYUNDAI Teer G700 SP 10W-40','Aceite Motor',NULL,10),(2,'HYUNDAI Teer D700 C2/C3 5W-30','Aceite Motor',NULL,NULL),(3,'MORE Ciclón SAE 20W/50','Aceite Motor',NULL,NULL),(4,'LUBRAX Tecno Si 10W-40','Aceite Motor',NULL,NULL),(5,'Shell Helix HX7 10W-40','Aceite Motor',NULL,NULL),(6,'Shell Helix HX8 Profesional 5W-30','Aceite Motor',NULL,NULL),(7,'Quartz 7000 10W-40','Aceite Motor',NULL,NULL),(8,'Quartz Ineo MCS 5W-30','Aceite Motor',NULL,NULL),(9,'Mobil Super 2000 10W-40','Aceite Motor',NULL,NULL),(10,'Mobil Super 3000 5W-30','Aceite Motor',NULL,NULL),(11,'Energy Premium 7908 SAE 5W-30','Aceite Motor',NULL,NULL),(12,'Energy Premium 7508 Mannol 5W-30','Aceite Motor',NULL,NULL),(13,'Classic 7501 Mannol 10W-40','Aceite Motor',NULL,NULL),(14,'Motul 6100 Syn-clean FE 5W-30','Aceite Motor',NULL,NULL),(15,'Liqui Moly 10W-40 Super Leichtlauf','Aceite Motor',NULL,NULL),(16,'Engine Oil 9976 Senfineco','Aceite Motor',NULL,NULL),(17,'DEXRON /// LUBRAX ATF TDX','Transmisión',NULL,NULL),(18,'VISTONY GEAR OIL Synthetic 75W-90','Transmisión',NULL,NULL),(19,'Fuel Injector Cleaner Senfineco','Aditivo',NULL,NULL),(20,'Brake Fluid DOT 3 Synthetic','Aditivo',NULL,NULL),(21,'DPF Foam Cleaner','Aditivo',NULL,NULL),(22,'Anticongelante Refrigerante 50/50 Ciclón','Refrigerante',NULL,NULL),(23,'Ice Freeze 33% Orgánico Vistony','Refrigerante',NULL,NULL),(24,'Anticongelante Ciclón 33%','Refrigerante',NULL,NULL),(25,'Coolant 715 Anticongelante','Refrigerante',NULL,NULL),(26,'Ciclón Coolant B-712','Refrigerante',NULL,NULL),(27,'Coolant Diesel Anticongelante','Refrigerante',NULL,NULL),(28,'Líquido para radiador verde','Refrigerante',NULL,NULL),(29,'Líquido para radiador rojo','Refrigerante',NULL,NULL),(30,'Agua desmineralizada','Refrigerante',NULL,NULL),(31,'Tapia Lavado en seco','Limpieza Exterior',NULL,NULL),(32,'Tapia Shampoo cera con carnauba','Limpieza Exterior',NULL,NULL),(33,'MAGIO COLOR CAR WASH WAX WATER','Limpieza Exterior',NULL,NULL),(34,'Cera Carnauba','Limpieza Exterior',NULL,NULL),(35,'Black Ciclón','Limpieza Exterior',NULL,NULL),(36,'Frutes Ciclón','Limpieza Exterior',NULL,NULL),(37,'Ice Blue Ciclón','Limpieza Exterior',NULL,NULL),(38,'Shampoo concentrado','Limpieza Exterior',NULL,NULL),(39,'Arlon Pintura Spray','Pintura',NULL,NULL),(40,'Strong Ultra Seal','Protección',NULL,NULL),(41,'GUYS HIGH GLOSS','Cera Detailing',NULL,NULL),(42,'CHEMICAL GUYS ACTIVE FUSION SHINE','Cera Detailing',NULL,NULL),(43,'EMICA CIELOM GUYS SHINE SPEED WIPE','Cera Detailing',NULL,NULL),(44,'Fabric Clean','Limpieza Interior',NULL,NULL),(45,'INNER CLEAN Interior Quick Detailer','Limpieza Interior',NULL,NULL),(46,'Tapia Plastic Restorer','Limpieza Interior',NULL,NULL),(47,'Tapia Protection Pro','Limpieza Interior',NULL,NULL),(48,'CHEMICAL GUYS Leather Cleaner/Conditioner','Limpieza Interior',NULL,NULL),(49,'Arlon limpia tapiz espuma','Limpieza Interior',NULL,NULL),(50,'AllClean All Purpose Cleaner Degreaser','Limpieza Interior',NULL,NULL),(51,'Water Stain Cleaner Deep Cleaner','Limpieza Interior',NULL,NULL),(52,'Water Spot Remover','Limpieza Interior',NULL,NULL),(53,'STRONG R GLASS CLEANER','Vidrios',NULL,NULL),(54,'Anti empañante','Vidrios',NULL,NULL),(55,'Limpia parabrisas','Vidrios',NULL,NULL),(56,'Desengrasante de motor','Motor',NULL,NULL),(57,'Limpia contactos eléctricos','Motor',NULL,NULL),(58,'Renovador de neumáticos','Renovadores',NULL,NULL),(59,'Silicona para tableros','Renovadores',NULL,NULL),(60,'Silicona aromática','Renovadores',NULL,NULL),(61,'Desodorante neutralizador tabaco','Aromas',NULL,NULL),(62,'Little Trees','Aromas',NULL,NULL),(63,'Limpiador de llantas','Llantas',NULL,NULL),(64,'Wheel Hub Cleaner STRONG CLEANER','Llantas',NULL,NULL),(65,'POLISHING AGENT W21','Pulido',NULL,NULL),(66,'STRONG FINAL TOUGH','Pulido',NULL,NULL),(67,'HEAVY D METAL POLISH','Pulido',NULL,NULL),(68,'Batería Platin Silver','Accesorio',NULL,NULL),(69,'BRM Plumilla Universal','Accesorio',NULL,NULL),(70,'Pinturas colores','Pintura',NULL,NULL),(71,'HYUNDAI Teer G700 SP 10W-40','Aceite Motor',NULL,NULL),(72,'HYUNDAI Teer D700 C2/C3 5W-30','Aceite Motor',NULL,NULL),(73,'MORE Ciclón SAE 20W/50','Aceite Motor',NULL,NULL),(74,'LUBRAX Tecno Si 10W-40','Aceite Motor',NULL,NULL),(75,'Shell Helix HX7 10W-40','Aceite Motor',NULL,NULL),(76,'Shell Helix HX8 Profesional 5W-30','Aceite Motor',NULL,NULL),(77,'Quartz 7000 10W-40','Aceite Motor',NULL,NULL),(78,'Quartz Ineo MCS 5W-30','Aceite Motor',NULL,NULL),(79,'Mobil Super 2000 10W-40','Aceite Motor',NULL,NULL),(80,'Mobil Super 3000 5W-30','Aceite Motor',NULL,NULL),(81,'Energy Premium 7908 SAE 5W-30','Aceite Motor',NULL,NULL),(82,'Energy Premium 7508 Mannol 5W-30','Aceite Motor',NULL,NULL),(83,'Classic 7501 Mannol 10W-40','Aceite Motor',NULL,NULL),(84,'Motul 6100 Syn-clean FE 5W-30','Aceite Motor',NULL,NULL),(85,'Liqui Moly 10W-40 Super Leichtlauf','Aceite Motor',NULL,NULL),(86,'Engine Oil 9976 Senfineco','Aceite Motor',NULL,NULL),(87,'DEXRON /// LUBRAX ATF TDX','Transmisión',NULL,NULL),(88,'VISTONY GEAR OIL Synthetic 75W-90','Transmisión',NULL,NULL),(89,'Fuel Injector Cleaner Senfineco','Aditivo',NULL,NULL),(90,'Brake Fluid DOT 3 Synthetic','Aditivo',NULL,NULL),(91,'DPF Foam Cleaner','Aditivo',NULL,NULL),(92,'Anticongelante Refrigerante 50/50 Ciclón','Refrigerante',NULL,NULL),(93,'Ice Freeze 33% Orgánico Vistony','Refrigerante',NULL,NULL),(94,'Anticongelante Ciclón 33%','Refrigerante',NULL,NULL),(95,'Coolant 715 Anticongelante','Refrigerante',NULL,NULL),(96,'Ciclón Coolant B-712','Refrigerante',NULL,NULL),(97,'Coolant Diesel Anticongelante','Refrigerante',NULL,NULL),(98,'Líquido para radiador verde','Refrigerante',NULL,NULL),(99,'Líquido para radiador rojo','Refrigerante',NULL,NULL),(100,'Agua desmineralizada','Refrigerante',NULL,NULL),(101,'Tapia Lavado en seco','Limpieza Exterior',NULL,NULL),(102,'Tapia Shampoo cera con carnauba','Limpieza Exterior',NULL,NULL),(103,'MAGIO COLOR CAR WASH WAX WATER','Limpieza Exterior',NULL,NULL),(104,'Cera Carnauba','Limpieza Exterior',NULL,NULL),(105,'Black Ciclón','Limpieza Exterior',NULL,NULL),(106,'Frutes Ciclón','Limpieza Exterior',NULL,NULL),(107,'Ice Blue Ciclón','Limpieza Exterior',NULL,NULL),(108,'Shampoo concentrado','Limpieza Exterior',NULL,NULL),(109,'Arlon Pintura Spray','Pintura',NULL,NULL),(110,'Strong Ultra Seal','Protección',NULL,NULL),(111,'GUYS HIGH GLOSS','Cera Detailing',NULL,NULL),(112,'CHEMICAL GUYS ACTIVE FUSION SHINE','Cera Detailing',NULL,NULL),(113,'EMICA CIELOM GUYS SHINE SPEED WIPE','Cera Detailing',NULL,NULL),(114,'Fabric Clean','Limpieza Interior',NULL,NULL),(115,'INNER CLEAN Interior Quick Detailer','Limpieza Interior',NULL,NULL),(116,'Tapia Plastic Restorer','Limpieza Interior',NULL,NULL),(117,'Tapia Protection Pro','Limpieza Interior',NULL,NULL),(118,'CHEMICAL GUYS Leather Cleaner/Conditioner','Limpieza Interior',NULL,NULL),(119,'Arlon limpia tapiz espuma','Limpieza Interior',NULL,NULL),(120,'AllClean All Purpose Cleaner Degreaser','Limpieza Interior',NULL,NULL),(121,'Water Stain Cleaner Deep Cleaner','Limpieza Interior',NULL,NULL),(122,'Water Spot Remover','Limpieza Interior',NULL,NULL),(123,'STRONG R GLASS CLEANER','Vidrios',NULL,NULL),(124,'Anti empañante','Vidrios',NULL,NULL),(125,'Limpia parabrisas','Vidrios',NULL,NULL),(126,'Desengrasante de motor','Motor',NULL,NULL),(127,'Limpia contactos eléctricos','Motor',NULL,NULL),(128,'Renovador de neumáticos','Renovadores',NULL,NULL),(129,'Silicona para tableros','Renovadores',NULL,NULL),(130,'Silicona aromática','Renovadores',NULL,NULL),(131,'Desodorante neutralizador tabaco','Aromas',NULL,NULL),(132,'Little Trees','Aromas',NULL,NULL),(133,'Limpiador de llantas','Llantas',NULL,NULL),(134,'Wheel Hub Cleaner STRONG CLEANER','Llantas',NULL,NULL),(135,'POLISHING AGENT W21','Pulido',NULL,NULL),(136,'STRONG FINAL TOUGH','Pulido',NULL,NULL),(137,'HEAVY D METAL POLISH','Pulido',NULL,NULL),(138,'Batería Platin Silver','Accesorio',NULL,NULL),(139,'BRM Plumilla Universal','Accesorio',NULL,NULL),(140,'Pinturas colores','Pintura',NULL,NULL);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13 18:07:36
