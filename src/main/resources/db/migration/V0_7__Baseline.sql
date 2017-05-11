-- MySQL dump 10.13  Distrib 5.5.55, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: msdb
-- ------------------------------------------------------
-- Server version	5.5.55-0+deb8u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories_event`
--

DROP TABLE IF EXISTS `categories_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories_event` (
  `event_edition_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  KEY `FK5w3fgfychgeakupnmv3ppy5yc` (`category_id`),
  KEY `FKrtfbwd4akrgtl0lkmfdvmuf9m` (`event_edition_id`),
  CONSTRAINT `FK5w3fgfychgeakupnmv3ppy5yc` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `FKrtfbwd4akrgtl0lkmfdvmuf9m` FOREIGN KEY (`event_edition_id`) REFERENCES `event_edition` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories_event`
--

LOCK TABLES `categories_event` WRITE;
/*!40000 ALTER TABLE `categories_event` DISABLE KEYS */;
INSERT INTO `categories_event` VALUES (3,10),(1,10),(6,9),(6,3),(6,4),(6,8),(7,9),(7,8),(7,4),(7,3),(5,11),(5,10),(9,2),(10,2),(12,2),(11,2),(13,2),(14,2),(15,2),(16,2),(17,2),(18,2),(19,2),(20,2),(21,2),(22,2),(8,2),(23,2),(24,2),(25,2),(27,12),(28,2),(4,9),(4,8),(4,3),(4,4),(29,2),(30,2),(26,2);
/*!40000 ALTER TABLE `categories_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `shortname` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (2,'Formula 1','F1','system','2017-04-05 18:00:47',NULL,NULL),(3,'Le Mans Prototype 1','LMP1','system','2017-04-05 18:00:47',NULL,NULL),(4,'Le Mans Prototype 2','LMP2','system','2017-04-05 18:00:47',NULL,NULL),(8,'Le Mans Grand Touring Endurance Pro','LM GTE Pro','system','2017-04-05 18:00:47',NULL,NULL),(9,'Le Mans Grand Touring Amateur','LM GTE AM','system','2017-04-05 18:00:47',NULL,NULL),(10,'Formula 3','F3','system','2017-04-05 18:00:47',NULL,NULL),(11,'Group GT3','GT3','system','2017-04-05 18:00:47',NULL,NULL),(12,'Indycar','Indycar','admin','2017-04-28 06:26:02','admin','2017-04-28 06:26:02');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chassis`
--

DROP TABLE IF EXISTS `chassis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chassis` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `manufacturer` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `debut_year` int(11) NOT NULL,
  `derived_from_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `rebranded` bit(1) DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKoagon0j3lk88m4fn1dtfwiud5` (`derived_from_id`),
  CONSTRAINT `FKoagon0j3lk88m4fn1dtfwiud5` FOREIGN KEY (`derived_from_id`) REFERENCES `chassis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chassis`
--

LOCK TABLES `chassis` WRITE;
/*!40000 ALTER TABLE `chassis` DISABLE KEYS */;
INSERT INTO `chassis` VALUES (1,'JSP2','Ligier',2014,NULL,'NULL',NULL,'system','2017-03-01 00:00:00','',NULL),(2,'03','Oreca',2011,NULL,'NULL',NULL,'system','2017-03-01 00:00:00','',NULL),(3,'05','Oreca',2015,2,'NULL',NULL,'system','2017-03-01 00:00:00','',NULL),(4,'07','Oreca',2017,3,'NULL',NULL,'system','2017-03-01 00:00:00','',NULL),(5,'Vantage GT2','Aston Martin',2008,NULL,'NULL',NULL,'system','2017-03-01 00:00:00','',NULL),(6,'Vantage GTE','Aston Martin',2012,5,'NULL',NULL,'system','2017-03-01 00:00:00','',NULL),(7,'B05/40','Lola',2006,NULL,'NULL',NULL,'system','2017-03-01 00:00:00','',NULL),(8,'B08/60','Lola',2008,7,'NULL',NULL,'system','2017-03-01 00:00:00','',NULL),(9,'Aston Martin B09/60','Lola',2009,8,'NULL',NULL,'system','2017-03-01 00:00:00','',NULL),(10,'AMR One','Aston Martin',2011,NULL,'NULL',NULL,'system','2017-03-01 00:00:00','',NULL),(11,'03','Pescarolo',2012,10,'NULL','','system','2017-03-01 00:00:00','',NULL),(12,'Delta Wing','All American Racers',2012,10,'https://res.cloudinary.com/msdb-cloud/image/upload/v1489920042/chassis/12.jpg','','system','2017-04-07 10:08:35','iclavijos','2017-04-07 10:08:35'),(13,'Dallara','F312',2012,NULL,NULL,'\0','system','2017-04-07 10:08:20','iclavijos','2017-04-07 10:08:20'),(14,'AMG F1 W08 EQ Power+','Mercedes',2017,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1492345530/chassis/14.jpg','\0','admin','2017-05-04 14:04:43','admin','2017-05-04 14:04:45'),(15,'SF70H','Ferrari',2017,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1492346699/chassis/15.jpg','\0','admin','2017-04-16 12:44:59','admin','2017-04-16 12:45:00'),(16,'VJM10','Force India',2017,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1492348389/chassis/16.jpg','\0','admin','2017-04-16 13:13:08','admin','2017-04-16 13:13:09'),(17,'VF-17','Haas',2017,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1492348584/chassis/17.jpg','\0','admin','2017-04-16 13:16:24','admin','2017-04-16 13:16:24'),(18,'MCL32','McLaren',2017,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1492348649/chassis/18.jpg','\0','admin','2017-04-16 13:17:29','admin','2017-04-16 13:17:30'),(19,'RB13','Red Bull',2017,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1492348779/chassis/19.jpg','\0','admin','2017-04-16 13:19:39','admin','2017-04-16 13:19:39'),(20,'RS17','Renault',2017,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1492348812/chassis/20.jpg','\0','admin','2017-04-16 13:20:12','admin','2017-04-16 13:20:13'),(21,'C36','Sauber',2017,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1492348875/chassis/21.jpg','\0','admin','2017-04-16 13:21:15','admin','2017-04-16 13:21:16'),(22,'STR12','Toro Rosso',2017,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1492348903/chassis/22.jpg','\0','admin','2017-04-16 13:21:43','admin','2017-04-16 13:21:44'),(23,'FW40','Williams',2017,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1492348925/chassis/23.jpg','\0','admin','2017-04-16 13:22:05','admin','2017-04-16 13:22:05'),(24,'DW12','Dallara',2012,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1493361695/chassis/24.jpg','\0','admin','2017-04-28 06:41:35','admin','2017-04-28 06:41:36'),(25,'MP4/22','McLaren',2007,NULL,NULL,'\0','admin','2017-05-04 14:03:32','admin','2017-05-04 14:03:32'),(26,'Ford Fusion Gen-6','Ford',2013,NULL,NULL,'\0','pontonesms','2017-05-10 21:02:52','pontonesms','2017-05-10 21:02:52'),(27,'Toyota Camry Gen-6','Toyota',2013,NULL,NULL,'\0','pontonesms','2017-05-10 21:03:19','pontonesms','2017-05-10 21:03:19'),(28,'Chevrolet SS Gen-6','Chevrolet',2013,NULL,NULL,'\0','pontonesms','2017-05-10 21:03:56','pontonesms','2017-05-10 21:03:56');
/*!40000 ALTER TABLE `chassis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver`
--

DROP TABLE IF EXISTS `driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `driver` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `surname` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` varchar(75) COLLATE utf8_unicode_ci DEFAULT NULL,
  `death_date` date DEFAULT NULL,
  `death_place` varchar(75) COLLATE utf8_unicode_ci DEFAULT NULL,
  `portrait_url` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=176 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver`
--

LOCK TABLES `driver` WRITE;
/*!40000 ALTER TABLE `driver` DISABLE KEYS */;
INSERT INTO `driver` VALUES (1,'Ayrton','Senna','1960-03-21','Sao Paulo, Brazil','1994-05-01','Imola, Italy','https://res.cloudinary.com/msdb-cloud/image/upload/v1488833007/driver/1.jpg','system','2017-03-01 00:00:00',NULL,NULL),(3,'Alain','Prost','1955-02-24','Lorette, France',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1488833027/driver/3.jpg','system','2017-03-01 00:00:00',NULL,NULL),(4,'Juan Manuel','Fangio','1911-06-22','Balcarce, Argentina','1995-07-17','Buenos Aires, Argentina','https://res.cloudinary.com/msdb-cloud/image/upload/v1489566911/driver/4.jpg','system','2017-03-01 00:00:00',NULL,NULL),(5,'Paul','Belmondo','1963-04-22','Boullogne Billancourt, France',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(6,'Lewis','Hamilton','1985-01-07','Stevenage, United Kingdom',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1494312209/driver/6.jpg','system','2017-05-09 08:43:29','admin','2017-05-09 08:43:29'),(7,'Jules','Bianchi','1989-08-03','Nice, France','2015-07-17','Nice, France',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(8,'Valtteri','Bottas','1989-08-28','Nastola, Finland',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(9,'Daniel','Ricciardo','1989-07-01','Perth, Australia',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(10,'Charles','Leclerc','1997-10-16','Montecarlo, Monaco',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(11,'Antonio','Fuoco','1996-05-20','Cariati, Italy',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(12,'Louis','Delétraz','1997-04-22','Geneva, Switzerland',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(13,'Gustav','Malja','1995-11-04','Malmö, Sweden',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(14,'Joey','Logano','1990-05-24','Connecticut, USA',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(15,'Luca','Ghiotto','1995-02-24','Arzignano, Italy',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(16,'Artem','Markelov','1994-09-10','Moskow, Russia',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(17,'Nobuharu','Matsushita','1993-10-14','Saitama, Japan',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(18,'Alexander','Albon','1996-03-23','London, England',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(19,'Oliver','Rowland','1992-08-10','Sheffield, England',NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,NULL),(21,'Michael','Schumacher','1969-01-03','Hürth, Germany',NULL,'',NULL,'system','2017-04-07 09:38:53','iclavijos','2017-04-07 09:38:53'),(22,'Jim','Clark','1936-03-04','Kilmany, Scotland','1968-04-07','Hockenheim, Germany',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(49,'Sam','Bird','1987-01-09','Roehampton, Greater London, England, UK',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491500035/driver/49.jpg','carlosoliden','2017-04-06 17:33:55','carlosoliden','2017-04-06 17:33:55'),(50,'José María \"Pechito\"','López','1983-04-26','Río Tercero, Argentina',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491427964/driver/50.jpg','carlosoliden','2017-04-05 21:32:44','carlosoliden','2017-04-05 21:32:45'),(51,'Nelson','Piquet Jr.','1985-07-25','Heidelberg, West Germany',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491428186/driver/51.jpg','carlosoliden','2017-04-05 21:36:26','carlosoliden','2017-04-05 21:36:27'),(52,'Oliver','Turvey','1987-04-01','Penrith, Cumbria, England, UK',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491428496/driver/52.jpg','carlosoliden','2017-04-05 21:41:36','carlosoliden','2017-04-05 21:41:37'),(53,'Stéphane','Sarrazin','1975-11-02','Alès, Gard, France',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491429338/driver/53.png','carlosoliden','2017-04-05 21:55:38','carlosoliden','2017-04-05 21:55:39'),(54,'Maro','Engel','1985-08-27','Munich, West Germany',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491429557/driver/54.jpg','carlosoliden','2017-04-05 21:59:17','carlosoliden','2017-04-05 21:59:17'),(55,'Loïc','Duval','1982-06-12','Chartres, France',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491429789/driver/55.jpg','carlosoliden','2017-04-05 22:03:09','carlosoliden','2017-04-05 22:03:10'),(56,'Jérôme','d\'Ambrosio','1985-12-27','Etterbeek, Belgium',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491430058/driver/56.jpg','carlosoliden','2017-04-05 22:07:38','carlosoliden','2017-04-05 22:07:39'),(57,'Nicolas ','Prost','1981-08-18','Saint-Chamond, Loire, France',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491499997/driver/57.png','carlosoliden','2017-04-06 17:33:17','carlosoliden','2017-04-06 17:33:18'),(58,'Sébastien','Buemi','1988-10-31','Aigle, Switzerland',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491500452/driver/58.jpg','carlosoliden','2017-04-06 17:40:52','carlosoliden','2017-04-06 17:40:54'),(60,'Lucas','di Grassi','1984-08-11','São Paulo, Brazil',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491501206/driver/60.jpg','carlosoliden','2017-04-06 17:53:25','carlosoliden','2017-04-06 17:53:27'),(61,'Daniel','Abt','1992-12-03','Kempten, Germany',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491501164/driver/61.jpg','carlosoliden','2017-04-06 17:52:27','carlosoliden','2017-04-06 17:52:45'),(62,'George','Russell','1998-02-15','King\'s Lynn, UK',NULL,'',NULL,'iclavijos','2017-04-07 09:38:06','iclavijos','2017-04-07 09:38:06'),(63,'Callum','Illott','1998-11-11','Cambridge, UK',NULL,'',NULL,'iclavijos','2017-04-07 09:38:06','iclavijos','2017-04-07 09:38:06'),(64,'António Félix','da Costa','1991-08-31','Lisbon, Portugal',NULL,'',NULL,'iclavijos','2017-04-07 09:38:06','iclavijos','2017-04-07 09:38:06'),(65,'Ségio','Sette Câmara','1998-05-23','Belo Horizonte, Brazil',NULL,'',NULL,'iclavijos','2017-04-07 09:38:06','iclavijos','2017-04-07 09:38:06'),(66,'Kenta','Yamashita','1995-08-03','Chiba, Japan',NULL,'',NULL,'iclavijos','2017-04-07 09:38:06','iclavijos','2017-04-07 09:38:06'),(67,'Jake','Huges','1994-05-30','Birmingham, UK',NULL,'',NULL,'iclavijos','2017-04-07 09:38:06','iclavijos','2017-04-07 09:38:06'),(68,'Maximilian','Günther','1997-07-02','Oberstdorf, Germany',NULL,'',NULL,'iclavijos','2017-04-07 09:38:06','iclavijos','2017-04-07 09:38:06'),(69,'Felix','Rosenqvist','1991-11-07','Värnamo, Sweden',NULL,'',NULL,'iclavijos','2017-05-05 09:11:15','admin','2017-05-05 09:11:15'),(70,'Lando','Norris','1999-11-13','Bristol, UK',NULL,'',NULL,'iclavijos','2017-04-07 09:38:06','iclavijos','2017-04-07 09:38:06'),(71,'Nick','Cassidy','1994-08-19','Auckland, New Zealand',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(72,'Daniel','Juncadella','1991-05-07','Barcelona, Spain',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(73,'Alexander','Sims','1988-03-15','London, UK',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(74,'Daniel','Ticktum','1999-06-08','London, UK',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(75,'Anthoine','Hubert','1996-09-22','Lyon, France',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(76,'David','Beckmann','2000-04-27','Iserlohn, Germany',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(77,'Sam','MacLeod','1994-11-09','Edinburgh, Scotland',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(78,'Arjun','Maini','1997-12-10','India',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(79,'Nikita','Mazepin','1999-03-02','Moscow, Rusia',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(80,'Joel','Eriksson','1998-06-28','Sweden',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(81,'Guanyu','Zhou','1999-05-30','Shanghai, China',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(82,'Pedro','Piquet','1998-07-03','Brasilia, Brazil',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(83,'Tadasuke','Makino','1997-06-28','Osaka, Japan',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(84,'Ferdinand','Habsburg','1997-06-21','Salzburg, Austria',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(85,'Wing','Chung Chang','1996-10-26','Macau, China',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(86,'Jann','Mardenborough','1991-09-09','Darlington, UK',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(87,'Daiki','Sasaki','1991-10-15','Saitama, Japan',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(88,'Hongli','Ye',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(89,'Keyvan Andres','Soori','2000-03-08','Cologne, Germany',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(90,'Sho','Tsuboi','1995-05-21','Saitama, Japan',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(98,'Lance','Stroll',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(100,'Esteban','Ocon',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(101,'Nico','Hulkenberg',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(102,'Jolyon','Palmer',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(103,'Kevin','Magnussen',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(104,'Romain','Grosjean',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(105,'Carlos','Sáinz',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(106,'Daniil','Kvyat',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(107,'Fernando','Alonso',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(108,'Stoffel','Vandoorne',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(109,'Markus','Ericsson',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(110,'Pascal','Wehrlein',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:40:33','iclavijos','2017-04-07 09:40:34'),(111,'Antonio','Giovinazzi',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:38:07','iclavijos','2017-04-07 09:38:07'),(114,'Sebastian','Vettel',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:41:14','iclavijos','2017-04-07 09:41:14'),(115,'Kimi','Raikonnen',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:41:14','iclavijos','2017-04-07 09:41:14'),(117,'Max','Verstappen',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:41:14','iclavijos','2017-04-07 09:41:14'),(118,'Felipe','Massa',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:41:14','iclavijos','2017-04-07 09:41:14'),(119,'Sergio','Pérez',NULL,'',NULL,'',NULL,'iclavijos','2017-04-07 09:41:14','iclavijos','2017-04-07 09:41:14'),(121,'Felix','Rosenqvist','1991-11-07','Värnamo, Sweden',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491846667/driver/121.jpg','carlosoliden','2017-04-10 17:51:07','carlosoliden','2017-04-10 17:51:08'),(122,'Nick','Heidfeld','1977-05-10','Mönchengladbach, West Germany',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491846840/driver/122.jpg','carlosoliden','2017-04-10 17:54:00','carlosoliden','2017-04-10 17:54:03'),(123,'Mitch','Evans','1994-06-24','Auckland, New Zealand',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491847130/driver/123.jpg','carlosoliden','2017-04-10 17:58:50','carlosoliden','2017-04-10 17:58:51'),(124,'Adam','Carroll','1982-10-25','Portadown, Northern Ireland, UK',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491847343/driver/124.jpg','carlosoliden','2017-04-10 18:02:23','carlosoliden','2017-04-10 18:02:25'),(125,'Jean-Éric','Vergne','1990-04-25','Pontoise, France',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491847905/driver/125.jpg','carlosoliden','2017-04-10 18:11:45','carlosoliden','2017-04-10 18:11:46'),(126,'Qinghua','Ma','1987-12-25','Shanghai, China',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491848719/driver/126.png','carlosoliden','2017-04-10 18:25:19','carlosoliden','2017-04-10 18:25:20'),(127,'Esteban','Gutiérrez','1991-08-05','Monterrey, Mexico',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491848973/driver/127.jpg','carlosoliden','2017-04-10 18:29:33','carlosoliden','2017-04-10 18:29:34'),(128,'Robin','Frijns','1991-08-07','Maastricht, Netherlands',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491849295/driver/128.jpg','carlosoliden','2017-04-10 18:34:54','carlosoliden','2017-04-10 18:34:56'),(129,'António','Félix da Costa','1991-08-31','Lisbon, Portugal',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1491849469/driver/129.jpg','carlosoliden','2017-04-10 18:37:48','carlosoliden','2017-04-10 18:37:50'),(130,'Sergio','Canamasas','1988-04-30','Barcelona, Spain',NULL,NULL,NULL,'sergi14','2017-04-17 21:01:35','sergi14','2017-04-17 21:01:35'),(131,'Nicholas','Latifi','1995-06-25','Toronto, Canada',NULL,NULL,NULL,'sergi14','2017-04-17 21:04:19','sergi14','2017-04-17 21:04:19'),(132,'Ralph','Boschung','1997-09-23','Monthey, Switzerland',NULL,NULL,NULL,'sergi14','2017-04-17 21:06:00','sergi14','2017-04-17 21:06:00'),(133,'Stefano','Coletti','1989-06-04','Montecarlo, Monaco',NULL,NULL,NULL,'sergi14','2017-04-17 21:09:21','sergi14','2017-04-17 21:09:21'),(134,'Jordan','King','1994-02-26','Warwick, United Kingdom',NULL,NULL,NULL,'sergi14','2017-04-17 21:10:37','sergi14','2017-04-17 21:10:37'),(135,'Nabil','Jeffri','1993-10-23','Kuala Lumpur, Malaysia',NULL,NULL,NULL,'sergi14','2017-04-17 21:11:36','sergi14','2017-04-17 21:11:36'),(136,'Nyck','De Vries','1995-02-06','Sneek, Netherlands',NULL,NULL,NULL,'sergi14','2017-04-17 21:12:48','sergi14','2017-04-17 21:12:48'),(137,'Johnny','Cecotto Jr','1989-09-09','Augsburg, Germany',NULL,NULL,NULL,'sergi14','2017-04-17 21:14:24','sergi14','2017-04-17 21:14:24'),(138,'Norman','Nato','1992-07-08','Cannes, France',NULL,NULL,NULL,'sergi14','2017-04-17 21:18:41','sergi14','2017-04-17 21:18:41'),(139,'Sean','Gelael','1996-11-01','Jakarta, Indonesia',NULL,NULL,NULL,'sergi14','2017-04-17 21:20:01','sergi14','2017-04-17 21:20:01'),(140,'Oriol','Servià','1974-07-11','Pals, Spain',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1493364100/driver/140.jpg','admin','2017-04-28 07:21:39','admin','2017-04-28 07:21:40'),(141,'Juan Pablo','Montoya','1975-09-19','Bogotá, Colombia',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1493364151/driver/141.jpg','admin','2017-04-28 07:22:31','admin','2017-04-28 07:22:32'),(142,'Sergey','Sirotkin','1995-08-27','Moscow, Russia',NULL,NULL,NULL,'admin','2017-04-28 10:07:31','admin','2017-04-28 10:07:33'),(143,'Nico','Rosberg','1985-06-27','Wiesbaden, Germany',NULL,NULL,NULL,'admin','2017-05-05 08:41:06','admin','2017-05-05 08:41:07'),(144,'Jamie','McMurray','1976-06-03','Misuri, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:49','pontonesms','2017-05-10 20:23:49'),(145,'Brad','Keselowski','1984-02-12','Michigan, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(146,'Austin','Dillon','1990-04-27','North Carolina, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(147,'Kevin','Harvick','1975-12-08','California, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(148,'Kasey','Kahne','1980-04-10','Washington, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(149,'Trevor','Bayne','1991-02-19','Tennessee, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(150,'Danica','Patrick','1982-03-25','Wisconsin, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(151,'Denny','Hamlin','1980-11-18','Florida, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(152,'Ty','Dillon','1992-02-27','North Carolina, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(153,'Clint','Bowyer','1979-05-30','Kansas, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(154,'Ricky','Stenhouse Jr.','1987-10-02','Misisipi, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(155,'Kyle','Busch','1985-05-02','Nevada, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(156,'Daniel','Su�rez','1992-01-07','Monterrey, Mexico',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(157,'Matt','Kenseth','1972-03-10','Wisconsin, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(158,'Ryan','Blaney','1993-12-31','North Carolina, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(159,'Chase','Elliott','1995-11-28','Georgia, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(160,'Paul','Menard','1980-08-21','Wisconsin, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(161,'Ryan','Newman','1977-12-08','Indiana, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(162,'Matt','DiBenedetto','1991-07-27','California, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(163,'Jeffrey','Earnhardt','1989-06-22','North Carolina, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(164,'Landon','Cassill','1989-07-07','Iowa, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(165,'Chris','Buescher','1992-10-29','Texas, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(166,'David','Ragan','1985-12-24','Georgia, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(167,'Kurt','Busch','1978-08-04','Nevada, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(168,'Kyle','Larson','1992-07-31','California, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(169,'Aric','Almirola','1984-03-14','Florida, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(170,'AJ','Allmendinger','1981-12-16','California, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(171,'Jimmie','Johnson','1975-09-17','California, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(172,'Cole','Whitt','1991-06-22','California, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(173,'Erik','Jones','1996-05-30','Michigan, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(174,'Martin','Truex Jr.','1980-06-29','New Jersey, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50'),(175,'Dale','Earnhardt Jr.','1974-10-10','North Carolina, USA',NULL,'',NULL,'pontonesms','2017-05-10 20:23:50','pontonesms','2017-05-10 20:23:50');
/*!40000 ALTER TABLE `driver` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers_entry`
--

DROP TABLE IF EXISTS `drivers_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `drivers_entry` (
  `entry_id` bigint(20) NOT NULL,
  `driver_id` bigint(20) NOT NULL,
  KEY `FKu0n9eukecbkj9ie90ef7n6yr` (`driver_id`),
  KEY `FKs6m6s4yk12ps4l0x0s3lb5r4e` (`entry_id`),
  CONSTRAINT `FKs6m6s4yk12ps4l0x0s3lb5r4e` FOREIGN KEY (`entry_id`) REFERENCES `event_entry` (`id`),
  CONSTRAINT `FKu0n9eukecbkj9ie90ef7n6yr` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers_entry`
--

LOCK TABLES `drivers_entry` WRITE;
/*!40000 ALTER TABLE `drivers_entry` DISABLE KEYS */;
INSERT INTO `drivers_entry` VALUES (1,6),(22,6),(63,6),(84,6),(2,8),(23,8),(64,8),(85,8),(11,9),(32,9),(73,9),(94,9),(20,98),(40,98),(82,98),(102,98),(6,100),(27,100),(68,100),(89,100),(13,101),(34,101),(75,101),(96,101),(14,102),(35,102),(76,102),(97,102),(8,103),(29,103),(70,103),(91,103),(7,104),(28,104),(69,104),(90,104),(19,105),(39,105),(81,105),(101,105),(18,106),(38,106),(80,106),(100,106),(9,107),(30,107),(71,107),(92,107),(104,107),(10,108),(31,108),(72,108),(93,108),(15,109),(36,109),(77,109),(98,109),(17,110),(37,110),(79,110),(99,110),(16,111),(3,114),(24,114),(65,114),(86,114),(4,115),(25,115),(66,115),(87,115),(12,117),(33,117),(74,117),(95,117),(21,118),(41,118),(83,118),(103,118),(5,119),(26,119),(67,119),(88,119),(105,140),(106,141),(107,142),(108,6),(109,143),(110,6),(112,119),(113,107),(114,98),(115,118),(116,108),(117,103),(118,106),(120,9),(122,100),(123,117),(124,6),(125,142),(126,114),(127,105),(128,115),(129,8),(130,104),(131,109),(132,110),(121,102),(119,101);
/*!40000 ALTER TABLE `drivers_entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `engine`
--

DROP TABLE IF EXISTS `engine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `engine` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `manufacturer` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `capacity` int(11) NOT NULL,
  `architecture` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `debut_year` int(11) NOT NULL,
  `petrol_engine` bit(1) DEFAULT NULL,
  `diesel_engine` bit(1) DEFAULT NULL,
  `electric_engine` bit(1) DEFAULT NULL,
  `turbo` bit(1) DEFAULT NULL,
  `derived_from_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `comments` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `other_engine` bit(1) DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3f0ohbb9nyaoheccc5xf3lfyl` (`derived_from_id`),
  CONSTRAINT `FK3f0ohbb9nyaoheccc5xf3lfyl` FOREIGN KEY (`derived_from_id`) REFERENCES `engine` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `engine`
--

LOCK TABLES `engine` WRITE;
/*!40000 ALTER TABLE `engine` DISABLE KEYS */;
INSERT INTO `engine` VALUES (1,'DFV','Cosworth',2993,'V8',1967,'',NULL,NULL,NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1489656140/engine/1.jpg',NULL,NULL,'system','2017-03-01 00:00:00',NULL,'2017-03-01 00:00:00'),(2,'DFY','Cosworth',2993,'V8',1983,'',NULL,NULL,NULL,1,NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,'2017-03-01 00:00:00'),(3,'DFZ','Cosworth',3494,'V8',1987,'',NULL,NULL,NULL,2,NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,'2017-03-01 00:00:00'),(12,'Type 912','Porsche',4500,'Flat 12',1970,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,'2017-03-01 00:00:00'),(13,'PU106C','Mercedes',1600,'V6',2016,'',NULL,'','',14,NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,'2017-03-01 00:00:00'),(14,'PU106B','Mercedes',1600,'V6',2015,'',NULL,'','',15,NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,'2017-03-01 00:00:00'),(15,'PU106A','Mercedes',1600,'V6',2014,'',NULL,'','',NULL,NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,'2017-03-01 00:00:00'),(16,'M08 EQ Power+','Mercedes',1600,'V6',2017,'',NULL,'','',NULL,NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,'2017-03-01 00:00:00'),(17,'DFR','Cosworth',3494,'V8',1988,'',NULL,NULL,NULL,3,NULL,NULL,NULL,'system','2017-03-01 00:00:00',NULL,'2017-03-01 00:00:00'),(18,'F3 Engine (2016)','Mercedes',2000,'4L',2016,'','\0','\0',NULL,NULL,NULL,NULL,NULL,'admin','2017-04-03 00:01:24','admin','2017-04-03 00:01:24'),(19,'F3 Engine (2016)','Volkswagen',2000,'4L',2016,'','\0','\0',NULL,NULL,NULL,NULL,NULL,'admin','2017-04-06 13:37:17','admin','2017-04-06 13:37:17'),(20,'062','Ferrari',1600,'V6',2017,'',NULL,'','',NULL,NULL,NULL,NULL,'admin','2017-04-16 12:44:03','admin','2017-04-16 12:44:03'),(21,'061','Ferrari',1600,'V6',2016,'',NULL,'','',NULL,NULL,NULL,NULL,'admin','2017-05-04 11:27:41','admin','2017-05-04 11:27:43'),(22,'RA617H','Honda',1600,'V6',2017,'',NULL,'','',NULL,NULL,NULL,NULL,'admin','2017-04-16 13:23:31','admin','2017-04-16 13:23:31'),(23,'RE17','Renault',1600,'V6',2017,'',NULL,'','',NULL,NULL,NULL,NULL,'admin','2017-04-16 13:24:06','admin','2017-04-16 13:24:06'),(24,'RB13','Tag Heuer',1600,'V6',2017,'',NULL,'','',23,NULL,NULL,NULL,'admin','2017-04-16 13:25:02','admin','2017-04-16 13:25:02'),(25,'HI17R','Honda',2200,'V6 Biturbo',2017,NULL,NULL,NULL,'',NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1493362279/engine/25.jpg',NULL,'','admin','2017-04-28 06:53:04','admin','2017-04-28 06:53:04'),(26,'IndyCar V6','Chevrolet',2200,'V6 Biturbo',2016,NULL,NULL,NULL,NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1493363021/engine/26.jpg',NULL,'','admin','2017-04-28 07:03:41','admin','2017-04-28 07:03:42'),(27,'FO 108T','Mercedes',2398,'V8',2007,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'admin','2017-05-04 11:21:27','admin','2017-05-04 11:21:27'),(28,'Ford FR9 EFI','Roush Yates',5867,'V8',2012,'',NULL,NULL,NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1494443583/engine/28.png',NULL,NULL,'pontonesms','2017-05-10 21:13:01','pontonesms','2017-05-10 21:13:03');
/*!40000 ALTER TABLE `engine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (1,'Macau Grand Prix',NULL,'system','2017-04-06 12:19:57',NULL,NULL),(2,'24 Hours of Le Mans','','system','2017-04-07 09:54:56','iclavijos','2017-04-07 09:54:56'),(3,'F1 European Grand Prix','Grand Prix of Europe','system','2017-05-09 12:04:25','admin','2017-05-09 12:04:25'),(4,'F1 Australian Grand Prix',NULL,'admin','2017-05-09 12:04:30','admin','2017-05-09 12:04:30'),(5,'F1 Bahrain Grand Prix',NULL,'admin','2017-05-09 12:04:37','admin','2017-05-09 12:04:37'),(6,'F1 Chinese Grand Prix',NULL,'iclavijos','2017-05-09 12:04:42','admin','2017-05-09 12:04:42'),(7,'F1 Russian Grand Prix',NULL,'admin','2017-05-10 17:05:21','admin','2017-05-10 17:05:21'),(8,'Indianapolis 500',NULL,'admin','2017-04-28 06:23:29','admin','2017-04-28 06:23:29'),(9,'F1 Spanish Grand Prix',NULL,'admin','2017-05-09 12:05:15','admin','2017-05-09 12:05:15');
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_edition`
--

DROP TABLE IF EXISTS `event_edition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_edition` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `edition_year` int(11) NOT NULL,
  `event_date` date NOT NULL,
  `long_event_name` varchar(100) NOT NULL,
  `short_event_name` varchar(40) NOT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `track_layout_id` bigint(20) DEFAULT NULL,
  `series_edition_id` bigint(20) DEFAULT NULL,
  `single_chassis` bit(1) DEFAULT NULL,
  `single_engine` bit(1) DEFAULT NULL,
  `single_tyre` bit(1) DEFAULT NULL,
  `single_fuel` bit(1) DEFAULT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  `multidriver` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgmx11c6swrcs9vlnes3oppf7l` (`event_id`),
  KEY `FKpubsp3txsybq9iwqm6dgbkak9` (`track_layout_id`),
  KEY `FKooj5xlejevfm8dyfrodd4vn8g` (`series_edition_id`),
  CONSTRAINT `FKgmx11c6swrcs9vlnes3oppf7l` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `FKooj5xlejevfm8dyfrodd4vn8g` FOREIGN KEY (`series_edition_id`) REFERENCES `series_edition` (`id`),
  CONSTRAINT `FKpubsp3txsybq9iwqm6dgbkak9` FOREIGN KEY (`track_layout_id`) REFERENCES `racetrack_layout` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_edition`
--

LOCK TABLES `event_edition` WRITE;
/*!40000 ALTER TABLE `event_edition` DISABLE KEYS */;
INSERT INTO `event_edition` VALUES (1,2016,'2016-11-20','Suncity Group Formula 3 Macau Grand Prix - FIA F3 World Cup','2016 GP Macau',1,37,NULL,'',NULL,'',NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(3,2015,'2015-11-22','Suncity Group 62nd Macau Grand Prix','2015 Macau GP',1,37,NULL,'',NULL,'',NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(4,2016,'2016-06-18','2016 24 Hours of Le Mans','2016 24 Hours of Le Mans',2,43,NULL,NULL,NULL,NULL,NULL,'system','2017-05-04 13:13:55','admin','2017-05-04 13:13:55',''),(5,2016,'2016-11-20','SJM Macau GT Cup - FIA GT World Cup','GT Macau Grand Prix',1,37,NULL,NULL,NULL,NULL,NULL,'system','2017-04-07 10:38:12','iclavijos','2017-04-07 10:38:12',NULL),(6,2015,'2015-06-13','2015 24 Hours of Le Mans','24 Hours of Le Mans',2,43,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(7,2014,'2014-06-14','2014 24 Hours of Le Mans','24 Hours of Le Mans',2,43,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(8,2016,'2016-06-19','2016 Formula 1 Grand Prix of Europe','2016 F1 GP Europe',3,45,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(9,2008,'2008-08-24','LII Telefónica Grand Prix of Europe','2008 F1 GP Europe',3,46,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(10,2009,'2009-08-23','LIII Telefónica Grand Prix of Europe','2009 F1 GP Europe',3,46,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(11,2010,'2010-06-27','LIV Grand Prix of Europe','2010 F1 GP Europe',3,46,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(12,2011,'2011-06-26','LV Grand Prix of Europe','2011 F1 GP Europe',3,46,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(13,2012,'2012-06-24','2012 Formula 1 Grand Prix of Europe','2012 F1 GP Europe',3,46,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(14,2007,'2007-07-22','LI Grand Prix of Europe','2007 F1 GP Europe',3,47,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(15,2006,'2006-05-07',' 2006 European Grand Prix',' 2006 European Grand Prix',3,47,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(16,2005,'2005-05-29','2005 European Grand Prix','2005 European Grand Prix',3,47,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(17,2004,'2004-05-30','2004 European Grand Prix','2004 European Grand Prix',3,47,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(18,2003,'2003-06-29','Allianz Grand Prix of Europe','2003 European Grand Prix',3,47,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(19,2002,'2002-06-23','XLVI Allianz Grand Prix of Europe','2002 European Grand Prix',3,47,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(20,2001,'2001-06-24','XLV Warsteiner Grand Prix of Europe','2001 European Grand Prix',3,47,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(21,2000,'2000-05-21','2000 European Grand Prix','2000 European Grand Prix',3,47,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(22,1999,'1999-09-26','XLIII Warsteiner Grand Prix d\'Europe','1999 European Grand Prix',3,47,NULL,NULL,NULL,NULL,NULL,'system','2017-04-05 18:01:01',NULL,NULL,NULL),(23,2017,'2017-03-26','2017 Formula 1 Rolex Australian Grand Prix','2017 Australian Grand Prix',4,48,NULL,NULL,NULL,NULL,NULL,'admin','2017-04-16 12:18:25','admin','2017-04-16 12:18:25','\0'),(24,2017,'2017-04-16','2017 Formula 1 Gulf Air Bahrain Grand Prix','2017 Bahrain Grand Prix',5,51,NULL,NULL,NULL,NULL,NULL,'admin','2017-04-16 17:52:12','admin','2017-04-16 17:52:12','\0'),(25,2017,'2017-04-09','2017 FORMULA 1 HEINEKEN CHINESE GRAND PRIX','2017 F1 Chinese Grand Prix',6,52,NULL,NULL,NULL,NULL,NULL,'iclavijos','2017-04-25 06:13:54','iclavijos','2017-04-25 06:13:54','\0'),(26,2017,'2017-04-30','2017 FORMULA 1 VTB RUSSIAN GRAND PRIX','2017 F1 Russian GP',7,53,NULL,NULL,NULL,NULL,NULL,'admin','2017-05-10 17:05:45','admin','2017-05-10 17:05:45','\0'),(27,2017,'2017-05-28','101st Indy 500 Presented by PennGrade Motor Oil','2017 Indy 500',8,54,NULL,NULL,NULL,NULL,NULL,'admin','2017-04-28 06:27:04','anonymousUser','2017-05-04 11:26:34','\0'),(28,2016,'2016-03-27','2016 Formula 1 Rolex Australian Grand Prix','2016 Australian GP F1',4,48,NULL,NULL,NULL,NULL,NULL,'admin','2017-05-03 19:31:45','admin','2017-05-03 19:31:45','\0'),(29,2007,'2007-03-25','LXXII ING Australian Grand Prix','2007 F1 Australian Grand Prix',4,48,NULL,NULL,NULL,NULL,NULL,'admin','2017-05-04 14:07:37','admin','2017-05-04 14:07:37','\0'),(30,2017,'2017-05-14','FORMULA 1 GRAN PREMIO DE ESPAÑA PIRELLI 2017','2017 F1 Spanish Grand Prix',9,55,NULL,NULL,NULL,NULL,NULL,'admin','2017-05-09 12:12:12','admin','2017-05-09 12:12:12','\0');
/*!40000 ALTER TABLE `event_edition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_entry`
--

DROP TABLE IF EXISTS `event_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_entry` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `team_name` varchar(100) NOT NULL,
  `driver_id` bigint(20) DEFAULT NULL,
  `chassis_id` bigint(20) NOT NULL,
  `engine_id` bigint(20) NOT NULL,
  `fuel_id` bigint(20) DEFAULT NULL,
  `operated_by_id` bigint(20) DEFAULT NULL,
  `tyres_id` bigint(20) NOT NULL,
  `event_edition_id` bigint(20) DEFAULT NULL,
  `race_number` varchar(4) NOT NULL,
  `team_id` bigint(20) NOT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfxa5a518g3l1rycm1eoeij69j` (`driver_id`),
  KEY `FK9at8hnqwxjt65qaisdq4obcqo` (`chassis_id`),
  KEY `FK997ond7rql17a9gbgo0ffdcax` (`engine_id`),
  KEY `FK66xgcxhs4hu11bh841hpsp1lr` (`fuel_id`),
  KEY `FKn01aani0dq7ejafdoauw1mnob` (`operated_by_id`),
  KEY `FKihtl9ar1ylviltg1pho7ehf0u` (`tyres_id`),
  KEY `FK6dlux0xsn9fev6jqt9if31ldo` (`event_edition_id`),
  KEY `FK4adbjy4sbwmfs4iyqqmrqg0ps_idx` (`team_id`),
  KEY `FKcad56d6x7ih3epo7cfakph3mf` (`category_id`),
  CONSTRAINT `FK4adbjy4sbwmfs4iyqqmrqg0ps` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK66xgcxhs4hu11bh841hpsp1lr` FOREIGN KEY (`fuel_id`) REFERENCES `fuel_provider` (`id`),
  CONSTRAINT `FK6dlux0xsn9fev6jqt9if31ldo` FOREIGN KEY (`event_edition_id`) REFERENCES `event_edition` (`id`),
  CONSTRAINT `FK997ond7rql17a9gbgo0ffdcax` FOREIGN KEY (`engine_id`) REFERENCES `engine` (`id`),
  CONSTRAINT `FK9at8hnqwxjt65qaisdq4obcqo` FOREIGN KEY (`chassis_id`) REFERENCES `chassis` (`id`),
  CONSTRAINT `FKcad56d6x7ih3epo7cfakph3mf` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `FKfxa5a518g3l1rycm1eoeij69j` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`id`),
  CONSTRAINT `FKihtl9ar1ylviltg1pho7ehf0u` FOREIGN KEY (`tyres_id`) REFERENCES `tyre_provider` (`id`),
  CONSTRAINT `FKn01aani0dq7ejafdoauw1mnob` FOREIGN KEY (`operated_by_id`) REFERENCES `team` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_entry`
--

LOCK TABLES `event_entry` WRITE;
/*!40000 ALTER TABLE `event_entry` DISABLE KEYS */;
INSERT INTO `event_entry` VALUES (1,'Mercedes AMG Petronas Motorsport',6,14,16,4,NULL,3,23,'44',22,2,'admin','2017-04-16 12:28:34','admin','2017-04-16 12:28:34'),(2,'Mercedes AMG Petronas Motorsport',8,14,16,4,NULL,3,23,'77',22,2,'admin','2017-04-16 12:29:34','admin','2017-04-16 12:29:34'),(3,'Scuderia Ferrari',114,15,20,2,NULL,3,23,'5',2,2,'admin','2017-04-16 12:45:57','admin','2017-04-16 12:45:57'),(4,'Scuderia Ferrari',115,15,20,2,NULL,3,23,'7',2,2,'admin','2017-04-16 12:46:45','admin','2017-04-16 12:46:45'),(5,'Sahara Force India F1 Team',119,16,16,NULL,NULL,3,23,'11',15,2,'admin','2017-04-16 13:14:28','admin','2017-04-16 13:14:28'),(6,'Sahara Force India F1 Team',100,16,16,NULL,NULL,3,23,'31',15,2,'admin','2017-04-16 13:15:29','admin','2017-04-16 13:15:29'),(7,'Haas F1 Team',104,17,20,NULL,NULL,3,23,'8',16,2,'admin','2017-04-16 13:26:52','admin','2017-04-16 13:26:52'),(8,'Haas F1 Team',103,17,20,NULL,NULL,3,23,'20',16,2,'admin','2017-04-16 13:28:30','admin','2017-04-16 13:28:30'),(9,'McLaren Honda Formula 1 Team',107,18,22,NULL,NULL,3,23,'14',1,2,'admin','2017-04-16 13:29:11','admin','2017-04-16 13:29:11'),(10,'McLaren Honda Formula 1 Team',108,18,22,NULL,NULL,3,23,'2',1,2,'admin','2017-04-16 13:30:02','admin','2017-04-16 13:30:02'),(11,'Red Bull Racing',9,19,24,NULL,NULL,3,23,'3',17,2,'admin','2017-04-16 13:31:28','admin','2017-04-16 13:31:28'),(12,'Red Bull Racing',117,19,24,NULL,NULL,3,23,'33',17,2,'admin','2017-04-16 13:31:57','admin','2017-04-16 13:31:57'),(13,' Renault Sport Formula One Team',101,20,23,NULL,NULL,3,23,'27',18,2,'admin','2017-04-16 13:33:00','admin','2017-04-16 13:33:00'),(14,' Renault Sport Formula One Team',102,20,23,NULL,NULL,3,23,'30',18,2,'admin','2017-04-16 13:33:30','admin','2017-04-16 13:33:30'),(15,'Sauber F1 Team',109,21,21,NULL,NULL,3,23,'9',19,2,'admin','2017-04-16 13:34:43','admin','2017-04-16 13:34:43'),(16,'Sauber F1 Team',111,21,21,NULL,NULL,3,23,'36',19,2,'admin','2017-04-16 13:35:24','admin','2017-04-16 13:35:24'),(17,'Sauber F1 Team',110,21,21,NULL,NULL,3,23,'94',19,2,'admin','2017-04-16 13:36:09','admin','2017-04-16 13:36:09'),(18,'Scuderia Toro Rosso',106,22,23,NULL,NULL,3,23,'26',20,2,'admin','2017-04-16 13:36:54','admin','2017-04-16 13:36:54'),(19,'Scuderia Toro Rosso',105,22,23,NULL,NULL,3,23,'55',20,2,'admin','2017-04-16 13:38:18','admin','2017-04-16 13:38:18'),(20,'Williams Martini Racing',98,23,16,NULL,NULL,3,23,'18',21,2,'admin','2017-04-16 13:39:12','admin','2017-04-16 13:39:12'),(21,'Williams Martini Racing',118,23,16,NULL,NULL,3,23,'19',21,2,'admin','2017-04-16 13:39:50','admin','2017-04-16 13:39:50'),(22,'Mercedes AMG Petronas Motorsport',6,14,16,4,NULL,3,24,'44',22,2,'admin','2017-04-16 12:28:34','admin','2017-04-16 12:28:34'),(23,'Mercedes AMG Petronas Motorsport',8,14,16,4,NULL,3,24,'77',22,2,'admin','2017-04-16 12:29:34','admin','2017-04-16 12:29:34'),(24,'Scuderia Ferrari',114,15,20,2,NULL,3,24,'5',2,2,'admin','2017-04-16 12:45:57','admin','2017-04-16 12:45:57'),(25,'Scuderia Ferrari',115,15,20,2,NULL,3,24,'7',2,2,'admin','2017-04-16 12:46:45','admin','2017-04-16 12:46:45'),(26,'Sahara Force India F1 Team',119,16,16,NULL,NULL,3,24,'11',15,2,'admin','2017-04-16 13:14:28','admin','2017-04-16 13:14:28'),(27,'Sahara Force India F1 Team',100,16,16,NULL,NULL,3,24,'31',15,2,'admin','2017-04-16 13:15:29','admin','2017-04-16 13:15:29'),(28,'Haas F1 Team',104,17,20,NULL,NULL,3,24,'8',16,2,'admin','2017-04-16 13:26:52','admin','2017-04-16 13:26:52'),(29,'Haas F1 Team',103,17,20,NULL,NULL,3,24,'20',16,2,'admin','2017-04-16 13:28:30','admin','2017-04-16 13:28:30'),(30,'McLaren Honda Formula 1 Team',107,18,22,NULL,NULL,3,24,'14',1,2,'admin','2017-04-16 13:29:11','admin','2017-04-16 13:29:11'),(31,'McLaren Honda Formula 1 Team',108,18,22,NULL,NULL,3,24,'2',1,2,'admin','2017-04-16 13:30:02','admin','2017-04-16 13:30:02'),(32,'Red Bull Racing',9,19,24,NULL,NULL,3,24,'3',17,2,'admin','2017-04-16 13:31:28','admin','2017-04-16 13:31:28'),(33,'Red Bull Racing',117,19,24,NULL,NULL,3,24,'33',17,2,'admin','2017-04-16 13:31:57','admin','2017-04-16 13:31:57'),(34,' Renault Sport Formula One Team',101,20,23,NULL,NULL,3,24,'27',18,2,'admin','2017-04-16 13:33:00','admin','2017-04-16 13:33:00'),(35,' Renault Sport Formula One Team',102,20,23,NULL,NULL,3,24,'30',18,2,'admin','2017-04-16 13:33:30','admin','2017-04-16 13:33:30'),(36,'Sauber F1 Team',109,21,21,NULL,NULL,3,24,'9',19,2,'admin','2017-04-16 13:34:43','admin','2017-04-16 13:34:43'),(37,'Sauber F1 Team',110,21,21,NULL,NULL,3,24,'94',19,2,'admin','2017-04-16 13:36:09','admin','2017-04-16 13:36:09'),(38,'Scuderia Toro Rosso',106,22,23,NULL,NULL,3,24,'26',20,2,'admin','2017-04-16 13:36:54','admin','2017-04-16 13:36:54'),(39,'Scuderia Toro Rosso',105,22,23,NULL,NULL,3,24,'55',20,2,'admin','2017-04-16 13:38:18','admin','2017-04-16 13:38:18'),(40,'Williams Martini Racing',98,23,16,NULL,NULL,3,24,'18',21,2,'admin','2017-04-16 13:39:12','admin','2017-04-16 13:39:12'),(41,'Williams Martini Racing',118,23,16,NULL,NULL,3,24,'19',21,2,'admin','2017-04-16 13:39:50','admin','2017-04-16 13:39:50'),(63,'Mercedes AMG Petronas Motorsport',6,14,16,4,NULL,3,25,'44',22,2,'admin','2017-04-16 12:28:34','admin','2017-04-16 12:28:34'),(64,'Mercedes AMG Petronas Motorsport',8,14,16,4,NULL,3,25,'77',22,2,'admin','2017-04-16 12:29:34','admin','2017-04-16 12:29:34'),(65,'Scuderia Ferrari',114,15,20,2,NULL,3,25,'5',2,2,'admin','2017-04-16 12:45:57','admin','2017-04-16 12:45:57'),(66,'Scuderia Ferrari',115,15,20,2,NULL,3,25,'7',2,2,'admin','2017-04-16 12:46:45','admin','2017-04-16 12:46:45'),(67,'Sahara Force India F1 Team',119,16,16,NULL,NULL,3,25,'11',15,2,'admin','2017-04-16 13:14:28','admin','2017-04-16 13:14:28'),(68,'Sahara Force India F1 Team',100,16,16,NULL,NULL,3,25,'31',15,2,'admin','2017-04-16 13:15:29','admin','2017-04-16 13:15:29'),(69,'Haas F1 Team',104,17,20,NULL,NULL,3,25,'8',16,2,'admin','2017-04-16 13:26:52','admin','2017-04-16 13:26:52'),(70,'Haas F1 Team',103,17,20,NULL,NULL,3,25,'20',16,2,'admin','2017-04-16 13:28:30','admin','2017-04-16 13:28:30'),(71,'McLaren Honda Formula 1 Team',107,18,22,NULL,NULL,3,25,'14',1,2,'admin','2017-04-16 13:29:11','admin','2017-04-16 13:29:11'),(72,'McLaren Honda Formula 1 Team',108,18,22,NULL,NULL,3,25,'2',1,2,'admin','2017-04-16 13:30:02','admin','2017-04-16 13:30:02'),(73,'Red Bull Racing',9,19,24,NULL,NULL,3,25,'3',17,2,'admin','2017-04-16 13:31:28','admin','2017-04-16 13:31:28'),(74,'Red Bull Racing',117,19,24,NULL,NULL,3,25,'33',17,2,'admin','2017-04-16 13:31:57','admin','2017-04-16 13:31:57'),(75,' Renault Sport Formula One Team',101,20,23,NULL,NULL,3,25,'27',18,2,'admin','2017-04-16 13:33:00','admin','2017-04-16 13:33:00'),(76,' Renault Sport Formula One Team',102,20,23,NULL,NULL,3,25,'30',18,2,'admin','2017-04-16 13:33:30','admin','2017-04-16 13:33:30'),(77,'Sauber F1 Team',109,21,21,NULL,NULL,3,25,'9',19,2,'admin','2017-04-16 13:34:43','admin','2017-04-16 13:34:43'),(79,'Sauber F1 Team',110,21,21,NULL,NULL,3,25,'94',19,2,'admin','2017-04-16 13:36:09','admin','2017-04-16 13:36:09'),(80,'Scuderia Toro Rosso',106,22,23,NULL,NULL,3,25,'26',20,2,'admin','2017-04-16 13:36:54','admin','2017-04-16 13:36:54'),(81,'Scuderia Toro Rosso',105,22,23,NULL,NULL,3,25,'55',20,2,'admin','2017-04-16 13:38:18','admin','2017-04-16 13:38:18'),(82,'Williams Martini Racing',98,23,16,NULL,NULL,3,25,'18',21,2,'admin','2017-04-16 13:39:12','admin','2017-04-16 13:39:12'),(83,'Williams Martini Racing',118,23,16,NULL,NULL,3,25,'19',21,2,'admin','2017-04-16 13:39:50','admin','2017-04-16 13:39:50'),(84,'Mercedes AMG Petronas Motorsport',6,14,16,4,NULL,3,26,'44',22,2,'admin','2017-04-16 12:28:34','admin','2017-04-16 12:28:34'),(85,'Mercedes AMG Petronas Motorsport',8,14,16,4,NULL,3,26,'77',22,2,'admin','2017-04-16 12:29:34','admin','2017-04-16 12:29:34'),(86,'Scuderia Ferrari',114,15,20,2,NULL,3,26,'5',2,2,'admin','2017-04-16 12:45:57','admin','2017-04-16 12:45:57'),(87,'Scuderia Ferrari',115,15,20,2,NULL,3,26,'7',2,2,'admin','2017-04-16 12:46:45','admin','2017-04-16 12:46:45'),(88,'Sahara Force India F1 Team',119,16,16,NULL,NULL,3,26,'11',15,2,'admin','2017-04-16 13:14:28','admin','2017-04-16 13:14:28'),(89,'Sahara Force India F1 Team',100,16,16,NULL,NULL,3,26,'31',15,2,'admin','2017-04-16 13:15:29','admin','2017-04-16 13:15:29'),(90,'Haas F1 Team',104,17,20,NULL,NULL,3,26,'8',16,2,'admin','2017-04-16 13:26:52','admin','2017-04-16 13:26:52'),(91,'Haas F1 Team',103,17,20,NULL,NULL,3,26,'20',16,2,'admin','2017-04-16 13:28:30','admin','2017-04-16 13:28:30'),(92,'McLaren Honda Formula 1 Team',107,18,22,NULL,NULL,3,26,'14',1,2,'admin','2017-04-16 13:29:11','admin','2017-04-16 13:29:11'),(93,'McLaren Honda Formula 1 Team',108,18,22,NULL,NULL,3,26,'2',1,2,'admin','2017-04-16 13:30:02','admin','2017-04-16 13:30:02'),(94,'Red Bull Racing',9,19,24,NULL,NULL,3,26,'3',17,2,'admin','2017-04-16 13:31:28','admin','2017-04-16 13:31:28'),(95,'Red Bull Racing',117,19,24,NULL,NULL,3,26,'33',17,2,'admin','2017-04-16 13:31:57','admin','2017-04-16 13:31:57'),(96,' Renault Sport Formula One Team',101,20,23,NULL,NULL,3,26,'27',18,2,'admin','2017-04-16 13:33:00','admin','2017-04-16 13:33:00'),(97,' Renault Sport Formula One Team',102,20,23,NULL,NULL,3,26,'30',18,2,'admin','2017-04-16 13:33:30','admin','2017-04-16 13:33:30'),(98,'Sauber F1 Team',109,21,21,NULL,NULL,3,26,'9',19,2,'admin','2017-04-16 13:34:43','admin','2017-04-16 13:34:43'),(99,'Sauber F1 Team',110,21,21,NULL,NULL,3,26,'94',19,2,'admin','2017-04-16 13:36:09','admin','2017-04-16 13:36:09'),(100,'Scuderia Toro Rosso',106,22,23,NULL,NULL,3,26,'26',20,2,'admin','2017-04-16 13:36:54','admin','2017-04-16 13:36:54'),(101,'Scuderia Toro Rosso',105,22,23,NULL,NULL,3,26,'55',20,2,'admin','2017-04-16 13:38:18','admin','2017-04-16 13:38:18'),(102,'Williams Martini Racing',98,23,16,NULL,NULL,3,26,'18',21,2,'admin','2017-04-16 13:39:12','admin','2017-04-16 13:39:12'),(103,'Williams Martini Racing',118,23,16,NULL,NULL,3,26,'19',21,2,'admin','2017-04-16 13:39:50','admin','2017-04-16 13:39:50'),(104,'McLaren Honda Andretti',107,24,25,NULL,32,5,27,'29',1,12,'admin','2017-04-28 07:26:28','admin','2017-04-28 07:26:28'),(105,'Rahal Letterman Laningan Racing',140,24,25,NULL,NULL,5,27,'16',40,12,'admin','2017-04-28 07:27:22','admin','2017-04-28 07:27:22'),(106,'Team Penske',141,24,26,NULL,NULL,5,27,'22',42,12,'admin','2017-04-28 07:28:07','admin','2017-04-28 07:28:07'),(107,'Renault Sport Formula One Team',142,20,23,NULL,NULL,3,26,'46',18,2,'admin','2017-04-28 10:02:16','admin','2017-04-28 10:02:16'),(108,'Mercedes F1 Team',NULL,14,13,NULL,NULL,3,28,'44',22,2,'admin','2017-05-03 19:33:30','admin','2017-05-03 19:33:30'),(109,'Mercedes F1 Team',NULL,14,13,NULL,NULL,3,28,'6',22,2,'admin','2017-05-03 19:33:55','admin','2017-05-03 19:33:55'),(110,'Team Vodafone McLaren',NULL,25,27,NULL,NULL,4,29,'4',1,2,'admin','2017-05-04 14:03:49','admin','2017-05-04 14:03:49'),(112,'Sahara Force India F1 Team',NULL,16,16,NULL,NULL,3,30,'11',15,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(113,'McLaren Honda Formula 1 Team',NULL,18,22,NULL,NULL,3,30,'14',1,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(114,'Williams Martini Racing',NULL,23,16,NULL,NULL,3,30,'18',21,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(115,'Williams Martini Racing',NULL,23,16,NULL,NULL,3,30,'19',21,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(116,'McLaren Honda Formula 1 Team',NULL,18,22,NULL,NULL,3,30,'2',1,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(117,'Haas F1 Team',NULL,17,20,NULL,NULL,3,30,'20',16,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(118,'Scuderia Toro Rosso',NULL,22,23,NULL,NULL,3,30,'26',20,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(119,'Renault Sport Formula One Team',NULL,20,23,NULL,NULL,3,30,'27',18,2,'admin','2017-05-10 17:39:58','admin','2017-05-10 17:39:58'),(120,'Red Bull Racing',NULL,19,24,NULL,NULL,3,30,'3',17,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(121,'Renault Sport Formula One Team',NULL,20,23,NULL,NULL,3,30,'30',18,2,'admin','2017-05-10 17:39:43','admin','2017-05-10 17:39:43'),(122,'Sahara Force India F1 Team',NULL,16,16,NULL,NULL,3,30,'31',15,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(123,'Red Bull Racing',NULL,19,24,NULL,NULL,3,30,'33',17,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(124,'Mercedes AMG Petronas Motorsport',NULL,14,16,4,NULL,3,30,'44',22,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(125,'Renault Sport Formula One Team',NULL,20,23,NULL,NULL,3,30,'46',18,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(126,'Scuderia Ferrari',NULL,15,20,2,NULL,3,30,'5',2,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(127,'Scuderia Toro Rosso',NULL,22,23,NULL,NULL,3,30,'55',20,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(128,'Scuderia Ferrari',NULL,15,20,2,NULL,3,30,'7',2,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(129,'Mercedes AMG Petronas Motorsport',NULL,14,16,4,NULL,3,30,'77',22,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(130,'Haas F1 Team',NULL,17,20,NULL,NULL,3,30,'8',16,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(131,'Sauber F1 Team',NULL,21,21,NULL,NULL,3,30,'9',19,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58'),(132,'Sauber F1 Team',NULL,21,21,NULL,NULL,3,30,'94',19,2,'admin','2017-05-10 17:30:58','admin','2017-05-10 17:30:58');
/*!40000 ALTER TABLE `event_entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_entry_result`
--

DROP TABLE IF EXISTS `event_entry_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_entry_result` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `best_lap_time` bigint(20) DEFAULT NULL,
  `final_position` int(11) DEFAULT NULL,
  `laps_completed` int(11) DEFAULT NULL,
  `retired` bit(1) DEFAULT NULL,
  `total_time` bigint(20) DEFAULT NULL,
  `cause` varchar(100) DEFAULT NULL,
  `session_id` bigint(20) DEFAULT NULL,
  `entry_id` bigint(20) DEFAULT NULL,
  `difference` bigint(20) DEFAULT NULL,
  `difference_type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK58j1hrg755b04rra3ahrve93k` (`session_id`),
  KEY `FKsf1qi8wtw9cpk5fisystw30lr` (`entry_id`),
  CONSTRAINT `FK58j1hrg755b04rra3ahrve93k` FOREIGN KEY (`session_id`) REFERENCES `event_session` (`id`),
  CONSTRAINT `FKsf1qi8wtw9cpk5fisystw30lr` FOREIGN KEY (`entry_id`) REFERENCES `event_entry` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_entry_result`
--

LOCK TABLES `event_entry_result` WRITE;
/*!40000 ALTER TABLE `event_entry_result` DISABLE KEYS */;
INSERT INTO `event_entry_result` VALUES (16,842200,1,22,'\0',NULL,NULL,16,1,NULL,NULL),(17,848030,2,25,'\0',NULL,NULL,16,2,NULL,NULL),(18,836200,1,34,'\0',NULL,NULL,17,1,NULL,NULL),(19,841760,2,34,'\0',NULL,NULL,17,2,NULL,NULL),(20,848860,3,19,'\0',NULL,NULL,16,11,NULL,NULL),(21,853720,5,16,'\0',NULL,NULL,16,4,NULL,NULL),(22,852460,4,19,'\0',NULL,NULL,16,12,NULL,NULL),(23,854640,6,10,'\0',NULL,NULL,16,3,NULL,NULL),(24,861420,7,28,'\0',NULL,NULL,16,21,NULL,NULL),(25,861680,8,20,'\0',NULL,NULL,16,7,NULL,NULL),(26,861830,9,15,'\0',NULL,NULL,16,13,NULL,NULL),(27,862760,10,29,'\0',NULL,NULL,16,5,NULL,NULL),(28,864500,11,24,'\0',NULL,NULL,16,19,NULL,NULL),(29,865140,12,25,'\0',NULL,NULL,16,18,NULL,NULL),(30,867340,13,29,'\0',NULL,NULL,16,20,NULL,NULL),(31,871160,14,18,'\0',NULL,NULL,16,9,NULL,NULL),(32,873480,15,30,'\0',NULL,NULL,16,15,NULL,NULL),(33,876560,16,23,'\0',NULL,NULL,16,6,NULL,NULL),(34,876670,17,20,'\0',NULL,NULL,16,8,NULL,NULL),(35,885390,18,22,'\0',NULL,NULL,16,17,NULL,NULL),(36,885850,19,6,'\0',NULL,NULL,16,14,NULL,NULL),(37,886950,20,14,'\0',NULL,NULL,16,10,NULL,NULL),(38,821880,1,NULL,'\0',NULL,NULL,19,1,NULL,NULL),(39,938260,1,57,'\0',56333740,NULL,21,24,NULL,NULL),(40,927980,2,57,'\0',NULL,NULL,21,22,66600,1),(41,940870,3,57,'\0',NULL,NULL,21,23,203970,1),(42,937200,4,57,'\0',NULL,NULL,21,25,224750,1),(43,934950,5,57,'\0',NULL,NULL,21,32,393460,1),(44,942560,6,57,'\0',NULL,NULL,21,41,543260,1),(45,946090,7,57,'\0',NULL,NULL,21,26,626060,1),(46,949480,8,57,'\0',NULL,NULL,21,28,748650,1),(47,953720,9,57,'\0',NULL,NULL,21,34,801880,1),(48,951790,10,57,'\0',NULL,NULL,21,27,957110,1),(49,967860,11,56,'\0',NULL,NULL,21,37,1,2),(50,949850,12,56,'\0',NULL,NULL,21,38,1,2),(51,955520,13,56,'\0',NULL,NULL,21,35,1,2),(52,NULL,14,54,'',NULL,'Engine',21,30,3,2),(53,950860,900,50,'',NULL,'Gearbox',21,36,7,2),(54,980260,900,12,'',NULL,'Accident with Stroll',21,39,NULL,NULL),(55,963030,900,12,'',NULL,'Accident with Sáinz',21,40,NULL,NULL),(56,966810,900,11,'',NULL,'Brakes',21,33,NULL,NULL),(57,987180,900,8,'',NULL,'Gearbox',21,29,NULL,NULL),(58,NULL,901,0,'',NULL,'Engine',21,31,NULL,NULL),(59,866380,1,57,'\0',50516720,NULL,20,3,NULL,NULL),(60,870330,2,57,'\0',NULL,NULL,20,1,99750,1),(61,865930,3,57,'\0',NULL,NULL,20,2,112500,1),(62,865380,4,57,'\0',NULL,NULL,20,4,223930,1),(63,869640,5,57,'\0',NULL,NULL,20,12,288270,1),(64,880450,6,57,'\0',NULL,NULL,20,21,833860,1),(65,883360,7,56,'\0',NULL,NULL,20,5,1,2),(66,876770,8,56,'\0',NULL,NULL,20,19,1,2),(67,867110,9,56,'\0',NULL,NULL,20,18,1,2),(68,884750,10,56,'\0',NULL,NULL,20,6,1,2),(69,884860,11,56,'\0',NULL,NULL,20,13,1,2),(70,890520,12,55,'\0',NULL,NULL,20,16,2,2),(71,894400,13,55,'\0',NULL,NULL,20,10,2,2),(72,900770,900,50,'',NULL,'Engine',20,9,NULL,NULL),(73,875680,900,46,'',NULL,'?',20,8,NULL,NULL),(74,893890,900,40,'',NULL,'?',20,20,NULL,NULL),(75,894470,900,25,'',NULL,'?',20,11,NULL,NULL),(76,920520,900,21,'',NULL,'?',20,15,NULL,NULL),(77,921950,900,15,'',NULL,'?',20,14,NULL,NULL),(78,901830,900,13,'',NULL,'?',20,7,NULL,NULL),(79,960740,1,19,'\0',NULL,NULL,23,87,NULL,NULL),(80,961190,2,24,'\0',NULL,NULL,23,85,NULL,NULL),(81,966810,3,23,'\0',NULL,NULL,23,84,NULL,NULL),(82,971740,4,19,'\0',NULL,NULL,23,95,NULL,NULL),(83,972300,5,19,'\0',NULL,NULL,23,86,NULL,NULL),(84,972900,6,19,'\0',NULL,NULL,23,94,NULL,NULL),(85,974570,7,29,'\0',NULL,NULL,23,88,NULL,NULL),(86,979000,8,29,'\0',NULL,NULL,23,103,NULL,NULL),(87,979440,9,30,'\0',NULL,NULL,23,102,NULL,NULL),(88,980650,10,28,'\0',NULL,NULL,23,89,NULL,NULL),(89,984960,11,17,'\0',NULL,NULL,23,100,NULL,NULL),(90,987470,12,23,'\0',NULL,NULL,23,91,NULL,NULL),(91,988130,13,16,'\0',NULL,NULL,23,92,NULL,NULL),(92,989760,14,17,'\0',NULL,NULL,23,101,NULL,NULL),(93,991580,15,16,'\0',NULL,NULL,23,97,NULL,NULL),(94,995330,16,17,'\0',NULL,NULL,23,90,NULL,NULL),(95,995410,17,19,'\0',NULL,NULL,23,93,NULL,NULL),(96,997310,18,21,'\0',NULL,NULL,23,99,NULL,NULL),(97,1000790,19,20,'\0',NULL,NULL,23,98,NULL,NULL),(98,0,20,2,'\0',NULL,NULL,23,107,NULL,NULL),(99,941200,1,36,'\0',NULL,NULL,24,86,NULL,NULL),(100,943830,2,36,'\0',NULL,NULL,24,87,NULL,NULL),(101,977900,3,36,'\0',NULL,NULL,24,85,NULL,NULL),(102,948290,4,34,'\0',NULL,NULL,24,84,NULL,NULL),(103,955400,5,15,'\0',NULL,NULL,24,95,NULL,NULL),(104,959100,6,26,'\0',NULL,NULL,24,94,NULL,NULL),(105,962610,7,39,'\0',NULL,NULL,24,103,NULL,NULL),(106,963290,8,38,'\0',NULL,NULL,24,96,NULL,NULL),(107,965060,9,31,'\0',NULL,NULL,24,91,NULL,NULL),(108,966000,10,38,'\0',NULL,NULL,24,88,NULL,NULL),(109,966540,11,39,'\0',NULL,NULL,24,89,NULL,NULL),(110,967650,12,27,'\0',NULL,NULL,24,92,NULL,NULL),(111,967710,13,22,'\0',NULL,NULL,24,97,NULL,NULL),(112,970390,14,31,'\0',NULL,NULL,24,90,NULL,NULL),(113,970830,15,36,'\0',NULL,NULL,24,101,NULL,NULL),(114,971250,16,25,'\0',NULL,NULL,24,93,NULL,NULL),(115,973000,17,35,'\0',NULL,NULL,24,100,NULL,NULL),(116,974410,18,30,'\0',NULL,NULL,24,99,NULL,NULL),(117,977470,19,36,'\0',NULL,NULL,24,102,NULL,NULL),(118,978190,20,29,'\0',NULL,NULL,24,98,NULL,NULL),(119,940010,1,17,'\0',NULL,NULL,25,86,NULL,NULL),(120,943380,2,16,'\0',NULL,NULL,25,87,NULL,NULL),(121,943640,3,20,'\0',NULL,NULL,25,85,NULL,NULL),(122,945420,4,19,'\0',NULL,NULL,25,84,NULL,NULL),(123,954520,5,21,'\0',NULL,NULL,25,95,NULL,NULL),(124,954710,6,17,'\0',NULL,NULL,25,103,NULL,NULL),(125,956620,7,15,'\0',NULL,NULL,25,96,NULL,NULL),(126,958300,8,24,'\0',NULL,NULL,25,94,NULL,NULL),(127,961640,9,20,'\0',NULL,NULL,25,101,NULL,NULL),(128,965560,10,19,'\0',NULL,NULL,25,91,NULL,NULL),(129,966490,11,19,'\0',NULL,NULL,25,102,NULL,NULL),(130,966760,12,22,'\0',NULL,NULL,25,89,NULL,NULL),(131,968460,13,18,'\0',NULL,NULL,25,100,NULL,NULL),(132,968690,14,12,'\0',NULL,NULL,25,92,NULL,NULL),(133,969620,15,21,'\0',NULL,NULL,25,88,NULL,NULL),(134,971640,16,20,'\0',NULL,NULL,25,90,NULL,NULL),(135,971820,17,15,'\0',NULL,NULL,25,93,NULL,NULL),(136,975030,18,21,'\0',NULL,NULL,25,98,NULL,NULL),(137,976570,19,17,'\0',NULL,NULL,25,99,NULL,NULL),(138,0,20,4,'\0',NULL,NULL,25,97,NULL,NULL),(139,931940,1,NULL,'\0',NULL,NULL,26,86,NULL,NULL),(140,932530,2,NULL,'\0',NULL,NULL,26,87,NULL,NULL),(141,932890,3,NULL,'\0',NULL,NULL,26,85,NULL,NULL),(142,937670,4,NULL,'\0',NULL,NULL,26,84,NULL,NULL),(143,949050,5,NULL,'\0',NULL,NULL,26,94,NULL,NULL),(144,951100,6,NULL,'\0',NULL,NULL,26,103,NULL,NULL),(145,951610,7,NULL,'\0',NULL,NULL,26,95,NULL,NULL),(146,952850,8,NULL,'\0',NULL,NULL,26,96,NULL,NULL),(147,953370,9,NULL,'\0',NULL,NULL,26,88,NULL,NULL),(148,954300,10,NULL,'\0',NULL,NULL,26,89,NULL,NULL),(149,959480,11,NULL,'\0',NULL,NULL,26,101,NULL,NULL),(150,959640,12,NULL,'\0',NULL,NULL,26,102,NULL,NULL),(151,959680,13,NULL,'\0',NULL,NULL,26,100,NULL,NULL),(152,960170,14,NULL,'\0',NULL,NULL,26,91,NULL,NULL),(153,966600,15,NULL,'\0',NULL,NULL,26,92,NULL,NULL),(154,964620,16,NULL,'\0',NULL,NULL,26,97,NULL,NULL),(155,970700,17,NULL,'\0',NULL,NULL,26,93,NULL,NULL),(156,973320,18,NULL,'\0',NULL,NULL,26,99,NULL,NULL),(157,975070,19,NULL,'\0',NULL,NULL,26,98,NULL,NULL),(158,976200,20,NULL,'\0',NULL,NULL,26,90,NULL,NULL),(161,973670,1,52,'\0',52887430,'',27,85,NULL,NULL),(162,987450,7,52,'\0',NULL,'',27,89,950040,1),(163,1009220,16,50,'\0',NULL,'',27,99,2,2),(164,NULL,900,0,'',NULL,'Brakes',27,94,NULL,NULL),(165,NULL,901,0,'',NULL,'Engine',27,92,NULL,NULL),(166,973120,2,52,'\0',NULL,'',27,86,6170,1),(167,968440,3,52,'\0',NULL,'',27,87,110000,1),(168,983980,4,52,'\0',NULL,'',27,84,363200,1),(169,984290,5,52,'\0',NULL,'',27,95,604160,1),(170,986610,6,52,'\0',NULL,'',27,88,867880,1),(171,984180,8,52,'\0',NULL,'',27,96,961880,1),(172,982320,9,51,'\0',NULL,'',27,103,1,2),(173,988580,10,51,'\0',NULL,'',27,101,1,2),(174,988700,11,51,'\0',NULL,'',27,102,1,2),(175,983000,12,51,'\0',NULL,'',27,100,1,2),(176,995660,13,51,'\0',NULL,'',27,91,1,2),(177,997900,14,51,'\0',NULL,'',27,93,1,2),(178,998350,15,51,'\0',NULL,'',27,98,1,2),(179,NULL,900,0,'',NULL,'Accident (with Grosjean)',27,97,NULL,NULL),(180,NULL,900,0,'',NULL,'Accident (with Palmer)',27,90,NULL,NULL);
/*!40000 ALTER TABLE `event_entry_result` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_session`
--

DROP TABLE IF EXISTS `event_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_session` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `duration` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `session_start_time` datetime NOT NULL,
  `shortname` varchar(10) NOT NULL,
  `event_edition_id` bigint(20) DEFAULT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  `additional_lap` bit(1) DEFAULT NULL,
  `duration_type` int(11) DEFAULT NULL,
  `awards_points` bit(1) DEFAULT NULL,
  `session_type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKj6w8bb9vw6o1crlpdbl18pjdp` (`event_edition_id`),
  CONSTRAINT `FKj6w8bb9vw6o1crlpdbl18pjdp` FOREIGN KEY (`event_edition_id`) REFERENCES `event_edition` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_session`
--

LOCK TABLES `event_session` WRITE;
/*!40000 ALTER TABLE `event_session` DISABLE KEYS */;
INSERT INTO `event_session` VALUES (1,40,'Free Practice 1','2016-11-17 09:35:00','FP1',1,'admin','2017-03-31 17:33:58','admin','2017-03-31 17:33:58',NULL,1,NULL,0),(2,40,'Qualifying 1','2016-11-17 14:20:00','Q1',1,'admin','2017-03-31 17:34:04','admin','2017-03-31 17:34:04',NULL,1,NULL,1),(3,40,'Free Practice 2','2016-11-18 09:35:00','FP2',1,'admin','2017-03-31 17:34:09','admin','2017-03-31 17:34:09',NULL,1,NULL,0),(4,40,'Qualifying 2','2016-11-18 15:55:00','Q2',1,'admin','2017-03-31 17:34:17','admin','2017-03-31 17:34:17',NULL,1,NULL,1),(5,10,'Qualifying Race','2016-11-19 13:50:00','QR',1,'admin','2017-03-31 17:37:13','admin','2017-03-31 17:37:13',NULL,5,NULL,2),(6,15,'Race','2016-11-20 15:30:00','R',1,'admin','2017-03-31 17:37:21','admin','2017-03-31 17:37:21',NULL,5,'',2),(10,24,'24 hours race','2016-06-18 15:00:00','Race',4,'admin','2017-03-31 17:02:17','admin','2017-03-31 17:02:17',NULL,2,NULL,2),(11,45,'Warm up','2016-06-18 09:00:00','WU',4,'admin','2017-03-31 17:05:42','admin','2017-03-31 17:05:42',NULL,1,NULL,0),(12,4,'First practice session','2016-06-15 16:00:00','FP1',4,'admin','2017-03-31 17:31:04','admin','2017-03-31 17:31:04','\0',2,NULL,0),(13,2,'First qualifying session','2016-06-15 22:00:00','Q1',4,'admin','2017-03-31 17:05:28','admin','2017-03-31 17:05:28',NULL,2,NULL,1),(14,2,'Second qualifying session','2016-06-16 19:00:00','Q2',4,'admin','2017-03-31 17:05:31','admin','2017-03-31 17:05:31',NULL,2,NULL,1),(15,2,'Third qualifying session','2016-06-16 22:00:00','Q3',4,'admin','2017-03-31 17:05:39','admin','2017-03-31 17:05:39',NULL,2,NULL,1),(16,90,'Free Practice 1','2017-03-24 10:00:00','FP1',23,'admin','2017-04-16 12:31:02','admin','2017-04-16 12:31:02','\0',1,'\0',0),(17,90,'Free Practice 2','2017-03-24 13:00:00','FP2',23,'admin','2017-04-16 12:31:28','admin','2017-04-16 12:31:28','\0',1,'\0',0),(18,60,'Free Practice 3','2017-03-25 10:00:00','FP3',23,'admin','2017-04-16 12:31:53','admin','2017-04-16 12:31:53','\0',1,'\0',0),(19,60,'Qualifying','2017-03-25 13:00:00','Q',23,'admin','2017-04-16 12:32:26','admin','2017-04-16 12:32:26','\0',1,'\0',1),(20,57,'Race','2017-03-26 12:00:00','R',23,'admin','2017-04-16 12:33:35','admin','2017-04-16 12:33:35','\0',5,'',2),(21,57,'Race','2017-04-16 16:00:00','R',24,'admin','2017-04-16 18:02:06','admin','2017-04-16 18:02:06','\0',5,'',2),(22,56,'Race','2017-04-09 12:00:00','R',25,'iclavijos','2017-04-25 06:14:39','iclavijos','2017-04-25 06:14:39','\0',5,'',2),(23,90,'Free Practice 1','2017-04-28 09:00:00','FP1',26,'admin','2017-04-28 05:33:23','admin','2017-04-28 05:33:23','\0',1,'\0',0),(24,90,'Free Practice 2','2017-04-28 13:00:00','FP2',26,'admin','2017-04-28 05:33:50','admin','2017-04-28 05:33:50','\0',1,'\0',0),(25,60,'Free Practice 3','2017-04-29 10:00:00','FP3',26,'admin','2017-04-28 05:34:20','admin','2017-04-28 05:34:20','\0',1,'\0',0),(26,60,'Qualifying','2017-04-29 13:00:00','Q',26,'admin','2017-04-28 05:34:43','admin','2017-04-28 05:34:43','\0',1,'\0',1),(27,53,'Race','2017-04-30 13:00:00','R',26,'admin','2017-04-28 05:35:29','admin','2017-04-28 05:35:29','\0',5,'',2),(28,6,'Indycar Series Practice 1','2017-05-15 10:00:00','Practice 1',27,'admin','2017-04-28 06:28:52','admin','2017-04-28 06:28:52','\0',2,'\0',0),(29,6,'Indycar Series Practice 2','2017-05-16 10:00:00','Practice 2',27,'admin','2017-04-28 06:29:36','admin','2017-04-28 06:29:36','\0',2,'\0',0),(30,6,'Indicar Series Practice 3','2017-05-18 10:00:00','Practice 3',27,'admin','2017-04-28 06:30:25','admin','2017-04-28 06:30:25','\0',2,'\0',0),(31,6,'Indycar Series Practice 4','2017-05-19 10:00:00','Practice 4',27,'admin','2017-04-28 06:33:39','admin','2017-04-28 06:33:39','\0',2,'\0',0),(32,1,'Indycar Series Practice 5','2017-05-20 09:00:00','Practice 5',27,'admin','2017-04-28 06:32:11','admin','2017-04-28 06:32:11','\0',2,'\0',0),(33,6,'Indycar Series Qualifications 1','2017-05-20 10:00:00','Qualify 1',27,'admin','2017-04-28 06:33:51','admin','2017-04-28 06:33:51','\0',2,'\0',1),(34,6,'IndyCar Series Qualifications 2','2017-05-21 10:00:00','Qualy 2',27,'admin','2017-04-28 06:34:46','admin','2017-04-28 06:34:46','\0',2,'\0',1),(35,1,'Indycar Series Practice 6','2017-05-26 09:00:00','Practice 6',27,'admin','2017-04-28 06:35:47','admin','2017-04-28 06:35:47','\0',2,'\0',0),(36,200,'Indy 500','2017-08-25 10:20:00','Race',27,'admin','2017-04-28 06:38:14','admin','2017-04-28 06:38:14','\0',5,'',2);
/*!40000 ALTER TABLE `event_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fuel_provider`
--

DROP TABLE IF EXISTS `fuel_provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fuel_provider` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  `logo_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fuel_provider`
--

LOCK TABLES `fuel_provider` WRITE;
/*!40000 ALTER TABLE `fuel_provider` DISABLE KEYS */;
INSERT INTO `fuel_provider` VALUES (2,'Shell','admin','2017-03-25 14:13:30','admin','2017-03-25 14:13:32','https://res.cloudinary.com/msdb-cloud/image/upload/v1490447366/fuelProvider/2.jpg'),(3,'Mobil 1','admin','2017-03-25 14:13:46','admin','2017-03-25 14:13:47','https://res.cloudinary.com/msdb-cloud/image/upload/v1490447593/fuelProvider/3.png'),(4,'Petronas','admin','2017-04-16 12:27:52','admin','2017-04-16 12:27:53','https://res.cloudinary.com/msdb-cloud/image/upload/v1491568085/fuelProvider/4.jpg'),(5,'Sunoco','pontonesms','2017-05-10 23:30:35','pontonesms','2017-05-10 23:30:36','https://res.cloudinary.com/msdb-cloud/image/upload/v1494451835/fuelProvider/5.png'),(6,'Elf','admin','2017-05-10 23:15:45','admin','2017-05-10 23:15:46','https://res.cloudinary.com/msdb-cloud/image/upload/v1494450946/fuelProvider/6.png');
/*!40000 ALTER TABLE `fuel_provider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jhi_authority`
--

DROP TABLE IF EXISTS `jhi_authority`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jhi_authority` (
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jhi_authority`
--

LOCK TABLES `jhi_authority` WRITE;
/*!40000 ALTER TABLE `jhi_authority` DISABLE KEYS */;
INSERT INTO `jhi_authority` VALUES ('ROLE_ADMIN'),('ROLE_EDITOR'),('ROLE_USER');
/*!40000 ALTER TABLE `jhi_authority` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jhi_persistent_audit_event`
--

DROP TABLE IF EXISTS `jhi_persistent_audit_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jhi_persistent_audit_event` (
  `event_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `principal` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `event_date` timestamp NULL DEFAULT NULL,
  `event_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `idx_persistent_audit_event` (`principal`,`event_date`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jhi_persistent_audit_event`
--

LOCK TABLES `jhi_persistent_audit_event` WRITE;
/*!40000 ALTER TABLE `jhi_persistent_audit_event` DISABLE KEYS */;
INSERT INTO `jhi_persistent_audit_event` VALUES (1,'admin','2017-02-15 19:22:27','AUTHENTICATION_SUCCESS'),(2,'admin','2017-02-15 21:48:40','AUTHENTICATION_SUCCESS'),(3,'admin','2017-02-22 06:51:50','AUTHENTICATION_SUCCESS'),(4,'admin','2017-02-24 08:34:15','AUTHENTICATION_SUCCESS'),(5,'admin','2017-02-24 08:45:59','AUTHENTICATION_SUCCESS'),(6,'admin','2017-03-03 11:48:24','AUTHENTICATION_SUCCESS'),(7,'admin','2017-03-03 17:48:08','AUTHENTICATION_SUCCESS'),(8,'admin','2017-03-03 17:50:54','AUTHENTICATION_SUCCESS'),(9,'admin','2017-03-04 13:16:45','AUTHENTICATION_FAILURE'),(10,'admin','2017-03-04 13:16:52','AUTHENTICATION_FAILURE'),(11,'admin','2017-03-04 13:17:10','AUTHENTICATION_SUCCESS'),(12,'admin','2017-03-04 13:18:10','AUTHENTICATION_SUCCESS'),(13,'admin','2017-03-04 15:34:31','AUTHENTICATION_FAILURE'),(14,'admin','2017-03-04 15:34:56','AUTHENTICATION_SUCCESS'),(15,'admin','2017-03-04 16:06:58','AUTHENTICATION_SUCCESS'),(16,'admin','2017-03-04 16:32:47','AUTHENTICATION_FAILURE'),(17,'user','2017-03-04 16:41:01','AUTHENTICATION_SUCCESS'),(18,'sergi14','2017-03-04 17:05:58','AUTHENTICATION_SUCCESS'),(19,'user','2017-03-04 17:11:36','AUTHENTICATION_SUCCESS'),(20,'admin','2017-03-04 18:13:03','AUTHENTICATION_FAILURE'),(21,'admin','2017-03-04 18:13:12','AUTHENTICATION_SUCCESS'),(22,'admin','2017-03-05 08:02:54','AUTHENTICATION_SUCCESS'),(23,'user','2017-03-05 09:05:33','AUTHENTICATION_SUCCESS'),(24,'admin','2017-03-05 09:06:17','AUTHENTICATION_SUCCESS'),(25,'oscargarcia','2017-03-05 10:01:01','AUTHENTICATION_SUCCESS'),(26,'dplazav','2017-03-05 10:44:56','AUTHENTICATION_SUCCESS'),(27,'baosouto@gmail.com','2017-03-05 16:56:59','AUTHENTICATION_FAILURE'),(28,'baosouto@gmail.com','2017-03-05 16:58:16','AUTHENTICATION_FAILURE'),(29,'baosouto@gmail.com','2017-03-05 16:58:19','AUTHENTICATION_FAILURE'),(30,'baosouto@gmail.com','2017-03-05 16:58:20','AUTHENTICATION_FAILURE'),(31,'baosouto@gmail.com','2017-03-05 16:58:21','AUTHENTICATION_FAILURE'),(32,'baosouto@gmail.com','2017-03-05 16:58:21','AUTHENTICATION_FAILURE'),(33,'baosouto@gmail.com','2017-03-05 16:58:21','AUTHENTICATION_FAILURE'),(34,'baosouto@gmail.com','2017-03-05 16:58:22','AUTHENTICATION_FAILURE'),(35,'pontonesms','2017-03-05 16:59:47','AUTHENTICATION_FAILURE'),(36,'admin','2017-03-05 19:03:30','AUTHENTICATION_SUCCESS'),(37,'admin','2017-03-05 19:03:33','AUTHENTICATION_SUCCESS'),(38,'admin','2017-03-16 16:37:17','AUTHENTICATION_FAILURE'),(39,'admin','2017-03-21 21:41:41','AUTHENTICATION_FAILURE'),(40,'admin','2017-03-21 21:41:49','AUTHENTICATION_SUCCESS'),(41,'carlos_oliden@yahoo.es','2017-03-31 10:32:39','AUTHENTICATION_FAILURE'),(42,'carlos_oliden@yahoo.es','2017-03-31 10:32:55','AUTHENTICATION_FAILURE'),(43,'carlosoliden','2017-03-31 10:33:12','AUTHENTICATION_SUCCESS'),(44,'admin','2017-03-31 10:46:07','AUTHENTICATION_FAILURE'),(45,'admin','2017-03-31 10:46:13','AUTHENTICATION_SUCCESS'),(46,'admin','2017-03-31 18:23:42','AUTHENTICATION_FAILURE'),(47,'admin','2017-03-31 18:23:49','AUTHENTICATION_SUCCESS'),(48,'carlosoliden','2017-04-05 21:24:13','AUTHENTICATION_SUCCESS'),(49,'carlosoliden','2017-04-05 22:22:15','AUTHENTICATION_SUCCESS'),(50,'admin','2017-04-08 10:27:54','AUTHENTICATION_SUCCESS'),(51,'admin','2017-04-08 10:34:40','AUTHENTICATION_FAILURE'),(52,'admin','2017-04-08 10:34:46','AUTHENTICATION_SUCCESS'),(53,'admin','2017-04-15 07:20:22','AUTHENTICATION_FAILURE'),(54,'admin','2017-04-15 07:20:28','AUTHENTICATION_SUCCESS'),(55,'admin','2017-04-16 12:00:19','AUTHENTICATION_SUCCESS'),(56,'admin','2017-04-16 17:42:04','AUTHENTICATION_SUCCESS'),(57,'admin','2017-04-16 17:45:58','AUTHENTICATION_SUCCESS'),(58,'admin','2017-04-16 18:35:29','AUTHENTICATION_FAILURE'),(59,'User','2017-04-16 18:47:23','AUTHENTICATION_FAILURE'),(60,'user','2017-04-16 18:47:49','AUTHENTICATION_FAILURE'),(61,'admin','2017-04-16 18:48:03','AUTHENTICATION_FAILURE'),(62,'admin','2017-04-16 18:48:07','AUTHENTICATION_FAILURE'),(63,'admin','2017-04-16 18:48:11','AUTHENTICATION_FAILURE'),(64,'admin','2017-04-16 18:48:12','AUTHENTICATION_FAILURE'),(65,'admin','2017-04-16 18:48:22','AUTHENTICATION_FAILURE'),(66,'admin','2017-04-16 18:49:25','AUTHENTICATION_FAILURE'),(67,'user','2017-04-16 18:54:37','AUTHENTICATION_FAILURE'),(68,'user','2017-04-16 18:54:39','AUTHENTICATION_FAILURE'),(69,'admin','2017-04-16 20:26:13','AUTHENTICATION_SUCCESS'),(70,'oscargarcia','2017-04-16 21:03:25','AUTHENTICATION_SUCCESS'),(71,'seralecam@gmail.com','2017-04-17 20:55:27','AUTHENTICATION_FAILURE'),(72,'seralecam@gmail.com','2017-04-17 20:55:36','AUTHENTICATION_FAILURE'),(73,'sergi14','2017-04-17 20:57:40','AUTHENTICATION_SUCCESS'),(74,'admin','2017-04-22 10:48:42','AUTHENTICATION_SUCCESS'),(75,'admin','2017-04-25 05:39:03','AUTHENTICATION_FAILURE'),(76,'admin','2017-04-25 05:39:09','AUTHENTICATION_SUCCESS'),(77,'admin','2017-04-25 09:33:03','AUTHENTICATION_SUCCESS'),(78,'admin','2017-04-28 05:26:53','AUTHENTICATION_SUCCESS'),(79,'admin','2017-04-28 06:12:14','AUTHENTICATION_FAILURE'),(80,'admin','2017-04-28 06:12:17','AUTHENTICATION_SUCCESS'),(81,'admin','2017-04-28 07:33:03','AUTHENTICATION_SUCCESS'),(82,'admin','2017-04-28 09:52:30','AUTHENTICATION_SUCCESS'),(83,'admin','2017-04-28 13:43:20','AUTHENTICATION_FAILURE'),(84,'admin','2017-04-28 13:43:25','AUTHENTICATION_SUCCESS'),(85,'admin','2017-04-29 10:42:33','AUTHENTICATION_SUCCESS'),(86,'admin','2017-04-29 13:57:37','AUTHENTICATION_FAILURE'),(87,'admin','2017-04-29 13:57:42','AUTHENTICATION_SUCCESS'),(88,'admin','2017-04-29 14:15:10','AUTHENTICATION_SUCCESS'),(89,'admin','2017-04-29 20:57:58','AUTHENTICATION_SUCCESS'),(90,'admin','2017-05-03 15:42:49','AUTHENTICATION_FAILURE'),(91,'admin','2017-05-03 15:42:53','AUTHENTICATION_FAILURE'),(92,'admin','2017-05-03 15:43:01','AUTHENTICATION_SUCCESS'),(93,'admin','2017-05-05 05:46:26','AUTHENTICATION_SUCCESS'),(94,'admin','2017-05-05 05:52:04','AUTHENTICATION_SUCCESS'),(95,'admin','2017-05-05 05:52:32','AUTHENTICATION_SUCCESS'),(96,'admin','2017-05-07 14:38:26','AUTHENTICATION_SUCCESS'),(97,'admin','2017-05-07 15:21:15','AUTHENTICATION_SUCCESS'),(98,'admin','2017-05-08 20:00:23','AUTHENTICATION_SUCCESS'),(99,'admin','2017-05-08 20:31:00','AUTHENTICATION_SUCCESS'),(100,'admin','2017-05-09 06:22:00','AUTHENTICATION_SUCCESS'),(101,'admin','2017-05-09 06:40:06','AUTHENTICATION_SUCCESS'),(102,'admin','2017-05-09 10:01:42','AUTHENTICATION_SUCCESS'),(103,'admin','2017-05-09 15:54:01','AUTHENTICATION_SUCCESS'),(104,'admin','2017-05-10 12:22:58','AUTHENTICATION_SUCCESS'),(105,'admin','2017-05-10 14:40:03','AUTHENTICATION_SUCCESS'),(106,'admin','2017-05-10 15:07:37','AUTHENTICATION_SUCCESS'),(107,'efeuno','2017-05-10 18:51:31','AUTHENTICATION_SUCCESS'),(108,'admin','2017-05-10 19:45:37','AUTHENTICATION_SUCCESS'),(109,'admin','2017-05-10 21:11:22','AUTHENTICATION_SUCCESS'),(110,'admin','2017-05-11 05:27:25','AUTHENTICATION_SUCCESS'),(111,'admin','2017-05-11 14:45:35','AUTHENTICATION_FAILURE'),(112,'user','2017-05-11 14:45:45','AUTHENTICATION_FAILURE'),(113,'albertfont','2017-05-11 14:49:05','AUTHENTICATION_SUCCESS');
/*!40000 ALTER TABLE `jhi_persistent_audit_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jhi_persistent_audit_evt_data`
--

DROP TABLE IF EXISTS `jhi_persistent_audit_evt_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jhi_persistent_audit_evt_data` (
  `event_id` bigint(20) NOT NULL,
  `name` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`event_id`,`name`),
  KEY `idx_persistent_audit_evt_data` (`event_id`),
  CONSTRAINT `FK2ehnyx2si4tjd2nt4q7y40v8m` FOREIGN KEY (`event_id`) REFERENCES `jhi_persistent_audit_event` (`event_id`),
  CONSTRAINT `fk_evt_pers_audit_evt_data` FOREIGN KEY (`event_id`) REFERENCES `jhi_persistent_audit_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jhi_persistent_audit_evt_data`
--

LOCK TABLES `jhi_persistent_audit_evt_data` WRITE;
/*!40000 ALTER TABLE `jhi_persistent_audit_evt_data` DISABLE KEYS */;
INSERT INTO `jhi_persistent_audit_evt_data` VALUES (9,'message','Bad credentials'),(9,'type','org.springframework.security.authentication.BadCredentialsException'),(10,'message','Bad credentials'),(10,'type','org.springframework.security.authentication.BadCredentialsException'),(13,'message','Bad credentials'),(13,'type','org.springframework.security.authentication.BadCredentialsException'),(16,'message','Bad credentials'),(16,'type','org.springframework.security.authentication.BadCredentialsException'),(20,'message','Bad credentials'),(20,'type','org.springframework.security.authentication.BadCredentialsException'),(27,'message','Bad credentials'),(27,'type','org.springframework.security.authentication.BadCredentialsException'),(28,'message','Bad credentials'),(28,'type','org.springframework.security.authentication.BadCredentialsException'),(29,'message','Bad credentials'),(29,'type','org.springframework.security.authentication.BadCredentialsException'),(30,'message','Bad credentials'),(30,'type','org.springframework.security.authentication.BadCredentialsException'),(31,'message','Bad credentials'),(31,'type','org.springframework.security.authentication.BadCredentialsException'),(32,'message','Bad credentials'),(32,'type','org.springframework.security.authentication.BadCredentialsException'),(33,'message','Bad credentials'),(33,'type','org.springframework.security.authentication.BadCredentialsException'),(34,'message','Bad credentials'),(34,'type','org.springframework.security.authentication.BadCredentialsException'),(35,'message','Bad credentials'),(35,'type','org.springframework.security.authentication.BadCredentialsException'),(38,'message','Bad credentials'),(38,'type','org.springframework.security.authentication.BadCredentialsException'),(39,'message','Bad credentials'),(39,'type','org.springframework.security.authentication.BadCredentialsException'),(41,'message','Bad credentials'),(41,'type','org.springframework.security.authentication.BadCredentialsException'),(42,'message','Bad credentials'),(42,'type','org.springframework.security.authentication.BadCredentialsException'),(44,'message','Bad credentials'),(44,'type','org.springframework.security.authentication.BadCredentialsException'),(46,'message','Bad credentials'),(46,'type','org.springframework.security.authentication.BadCredentialsException'),(51,'message','Bad credentials'),(51,'type','org.springframework.security.authentication.BadCredentialsException'),(53,'message','Bad credentials'),(53,'type','org.springframework.security.authentication.BadCredentialsException'),(58,'message','Bad credentials'),(58,'type','org.springframework.security.authentication.BadCredentialsException'),(59,'message','Bad credentials'),(59,'type','org.springframework.security.authentication.BadCredentialsException'),(60,'message','Bad credentials'),(60,'type','org.springframework.security.authentication.BadCredentialsException'),(61,'message','Bad credentials'),(61,'type','org.springframework.security.authentication.BadCredentialsException'),(62,'message','Bad credentials'),(62,'type','org.springframework.security.authentication.BadCredentialsException'),(63,'message','Bad credentials'),(63,'type','org.springframework.security.authentication.BadCredentialsException'),(64,'message','Bad credentials'),(64,'type','org.springframework.security.authentication.BadCredentialsException'),(65,'message','Bad credentials'),(65,'type','org.springframework.security.authentication.BadCredentialsException'),(66,'message','Bad credentials'),(66,'type','org.springframework.security.authentication.BadCredentialsException'),(67,'message','Bad credentials'),(67,'type','org.springframework.security.authentication.BadCredentialsException'),(68,'message','Bad credentials'),(68,'type','org.springframework.security.authentication.BadCredentialsException'),(71,'message','Bad credentials'),(71,'type','org.springframework.security.authentication.BadCredentialsException'),(72,'message','Bad credentials'),(72,'type','org.springframework.security.authentication.BadCredentialsException'),(75,'message','Bad credentials'),(75,'type','org.springframework.security.authentication.BadCredentialsException'),(79,'message','Bad credentials'),(79,'type','org.springframework.security.authentication.BadCredentialsException'),(83,'message','Bad credentials'),(83,'type','org.springframework.security.authentication.BadCredentialsException'),(86,'message','Bad credentials'),(86,'type','org.springframework.security.authentication.BadCredentialsException'),(90,'message','Bad credentials'),(90,'type','org.springframework.security.authentication.BadCredentialsException'),(91,'message','Bad credentials'),(91,'type','org.springframework.security.authentication.BadCredentialsException'),(111,'message','Bad credentials'),(111,'type','org.springframework.security.authentication.BadCredentialsException'),(112,'message','Bad credentials'),(112,'type','org.springframework.security.authentication.BadCredentialsException');
/*!40000 ALTER TABLE `jhi_persistent_audit_evt_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jhi_social_user_connection`
--

DROP TABLE IF EXISTS `jhi_social_user_connection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jhi_social_user_connection` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `provider_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `provider_user_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `rank` bigint(20) NOT NULL,
  `display_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `profile_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `access_token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `secret` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `refresh_token` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `expire_time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`provider_id`,`provider_user_id`),
  UNIQUE KEY `user_id_2` (`user_id`,`provider_id`,`rank`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jhi_social_user_connection`
--

LOCK TABLES `jhi_social_user_connection` WRITE;
/*!40000 ALTER TABLE `jhi_social_user_connection` DISABLE KEYS */;
INSERT INTO `jhi_social_user_connection` VALUES (2,'iclavijos','twitter','19344436',1,'@iclavijos','http://twitter.com/iclavijos','http://pbs.twimg.com/profile_images/745140092457492481/klklus1A_normal.jpg','19344436-QOMx6Xk8pDwroeBWtriEba2Ip1CnebPwYD3p2Shl3','kPfoAdZOCZUWmdQzZB1xBM6VC8mBXK3tEHbgqBW20TBTg',NULL,NULL),(4,'pontonesms','twitter','3005985335',1,'@Pontomery','http://twitter.com/Pontomery','http://pbs.twimg.com/profile_images/849671304081018880/VJ6cefLW_normal.jpg','3005985335-xJAebYukav5UO6LewdkNwucBNo84IAfUpKgf1mW','m8QW0HFLxjXGTqhvSc3herZT5w3lxgIVo4gpaqWL4ab3U',NULL,NULL),(5,'dinsv10','twitter','109964705',1,'@dinsV10','http://twitter.com/dinsV10','http://pbs.twimg.com/profile_images/810471828925874176/sfcaWcBo_normal.jpg','109964705-yYgNQWPP3RoPTLpUmWXcoaTuok3vbBGUrOBZEwYC','fHvjOWhhDURf96HWV7MiNeunIgQAzGZ4VwWiQl9AKhnoe',NULL,NULL),(6,'davidrubia','twitter','16085696',1,'@davidrubia','http://twitter.com/davidrubia','http://pbs.twimg.com/profile_images/414439540624199680/Hu4IwWy9_normal.jpeg','16085696-DEOgTZOMoR9M4LytGL7sKdehA05Hf3jGWAfuTLuvS','pNKJvMKRyPa0Q8KRURDHOxsaJp31s9HVWGWRD6LI55Bmd',NULL,NULL),(7,'stefifm','twitter','221840641',1,'@stefifm','http://twitter.com/stefifm','http://pbs.twimg.com/profile_images/820667428904562689/lBvzFWCp_normal.jpg','221840641-ktfKofA0LhPW58zOqDY0WIJtyRg6h8JfF69cRxKy','nDvpVEf49NWItgidRZz6g1yDEQUG3udlnMDYKYhga66Vv',NULL,NULL),(8,'joseantonio_gl','twitter','241556483',1,'@JoseAntonio_GL','http://twitter.com/JoseAntonio_GL','http://pbs.twimg.com/profile_images/817769158347816960/aJvL0vXo_normal.jpg','241556483-5kpJPemFwkHVa87aZf4cx565iVqLai3aUcX9DgPX','IIzb5wSeF4YwhYANkzQs2kNTKXLq2jMSPVPbsUi9fnOsD',NULL,NULL),(9,'pdeory','twitter','193753058',1,'@pdeory','http://twitter.com/pdeory','http://pbs.twimg.com/profile_images/817695831629434881/Y9yQXFkn_normal.jpg','193753058-PolDiuQPxeEcZ6I4qaCcaNv729TYmmeOSz7AdqQm','ZgbacXho6OWDYO5w0jRzKZLSyXCVYtljbwhcxWhjGKsiy',NULL,NULL),(10,'abf1_','twitter','2861712550',1,'@abF1_','http://twitter.com/abF1_','http://pbs.twimg.com/profile_images/839598266694127616/g_Lrisp3_normal.jpg','2861712550-zXETiH61NIV1ZBOEfgO2hpncVhhC6cPldl4cxnk','7Ni2c13DDBuVPmyLqu1vetRdnqm14fIBNGfyjCPShhbOv',NULL,NULL),(11,'tfinishline_','twitter','1269985368',1,'@TFinishLine_','http://twitter.com/TFinishLine_','http://pbs.twimg.com/profile_images/839770908243947520/DlaY_YpG_normal.jpg','1269985368-IuzXXd3X9NuwchQFnfpsfmV6UYtQ20fvwNGX4S9','OsiOiPNq8kuRSJ6TMrogla2LGt5ko1YKlVfR9xO8iiJPi',NULL,NULL),(12,'iclavijos','facebook','10207959937690530',1,'Ivan Clavijos Esteban','https://www.facebook.com/app_scoped_user_id/10207959937690530/','https://graph.facebook.com/v2.5/10207959937690530/picture','EAAWknJTHNWcBANZAMFFRQROuv1a5JSJ824nEV19NzimohzoAUqqWZAyv29od13agJgZBpBY8TomrvQUMFpL8uQLUZCngV9pWf4yuSTtXgdCiljssM1wZAyZAcbLLtS2FlpaTphZCdMjQkXOkXZAiZCZBZCz2xYAT2BeVkYZD',NULL,NULL,1499495772433);
/*!40000 ALTER TABLE `jhi_social_user_connection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jhi_user`
--

DROP TABLE IF EXISTS `jhi_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jhi_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `login` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  `first_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `image_url` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `activated` bit(1) NOT NULL,
  `lang_key` varchar(5) COLLATE utf8_unicode_ci DEFAULT NULL,
  `activation_key` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `reset_key` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_date` timestamp NULL DEFAULT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  UNIQUE KEY `idx_user_login` (`login`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `idx_user_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jhi_user`
--

LOCK TABLES `jhi_user` WRITE;
/*!40000 ALTER TABLE `jhi_user` DISABLE KEYS */;
INSERT INTO `jhi_user` VALUES (1,'system','$2a$10$mE.qmcV0mFU5NcKh73TZx.z4ueI/.bDWbj0T1BYyqP481kGGarKLG','System','System','system@localhost','','','en',NULL,NULL,'system','2017-02-15 19:18:12',NULL,'system',NULL),(2,'anonymoususer','$2a$10$j8S5d7Sr7.8VTOYNviDPOeWX8KcYILUVJBsYV83Y5NtECayypx9lO','Anonymous','User','anonymous@localhost','','','en',NULL,NULL,'system','2017-02-15 19:18:12',NULL,'system',NULL),(3,'admin','$2a$10$RIf0acADas8SI/dsrI9aau9BcJXjduOmN8KA4rBXDPHofcMqHjbGi','Administrator','Administrator','admin@localhost','','','en',NULL,NULL,'system','2017-02-15 19:18:12',NULL,'admin','2017-05-08 20:00:39'),(8,'iclavijos','$2a$10$wKwSAP/xGzOfycTH0hi7ZeR4Qmh2JYV1gJC3ObRj5s9wPU.yW9vxm','Ivan','Clavijos','iclavijos@gmail.com','http://pbs.twimg.com/profile_images/745140092457492481/klklus1A_normal.jpg','','en',NULL,'41229190352382883409','anonymousUser','2017-03-04 13:17:31','2017-03-12 11:57:19','anonymousUser','2017-03-12 11:57:19'),(10,'sergi14','$2a$10$wZ6ala/fOmDL8nd7Ip.19.gQmPU0XuTUZ60a//EBtFX1lqFw0HEhK',NULL,NULL,'seralecam@gmail.com',NULL,'','es','93985884770073326324',NULL,'anonymousUser','2017-03-04 16:35:46',NULL,'admin','2017-03-04 16:52:04'),(11,'oscargarcia','$2a$10$BY0nQX575fmXJSA3esCUbuySQEuUbTV7NaSj5wY6YF8Vwhr57CD7.',NULL,NULL,'oalfonso@yahoo.com',NULL,'','en','63116865809533841065',NULL,'anonymousUser','2017-03-05 09:54:49',NULL,'admin','2017-03-05 09:57:24'),(12,'dplazav','$2a$10$y/jOHLayrf59/x3pJurNxO0bR1NaAUJyG40CwedYGweJXufHdeL.m','David','Plaza Vallejo','dplazav@gmail.com',NULL,'','es','46811133575497508943',NULL,'anonymousUser','2017-03-05 10:19:57',NULL,'dplazav','2017-03-05 10:45:14'),(14,'pontonesms','$2a$10$YgrERCfZ95cYxDOo18il/eaCo9CA6.MJAcPpqFF7tnuFIy0dM70uq','Ponty',NULL,'aficionadoformulero@gmail.com','http://pbs.twimg.com/profile_images/817113324248825856/jBxgqmQB_normal.jpg','','en',NULL,NULL,'anonymousUser','2017-03-05 16:58:31',NULL,'anonymousUser','2017-03-05 16:58:31'),(15,'carlosoliden','$2a$10$Cb64Xa3iN4JE4U45z4amKeyI4TBqKwWrM/n6yX.PfBp6./64iAMDe',NULL,NULL,'carlos_oliden@yahoo.es',NULL,'','en',NULL,NULL,'anonymousUser','2017-03-31 10:30:05',NULL,'anonymousUser','2017-03-31 10:32:32'),(16,'dinsv10','$2a$10$NBcP2nQs5DvS7k1p0IRssuIPLC6VniBe2a9Up6WBC.pgArG5Z8sqa','Juanjo','Fernández','juanjofdezmacias@hotmail.es','http://pbs.twimg.com/profile_images/810471828925874176/sfcaWcBo_normal.jpg','','en',NULL,NULL,'anonymousUser','2017-04-08 10:23:14',NULL,'anonymousUser','2017-04-08 10:23:14'),(17,'davidrubia','$2a$10$oEqbBEgyHNss9ViUCtkwYOH.fmKUDhnU07EMrne/X2ZoiInlkIdai','David','다비드','david.rubia@gmail.com','http://pbs.twimg.com/profile_images/414439540624199680/Hu4IwWy9_normal.jpeg','','en',NULL,NULL,'anonymousUser','2017-04-16 18:34:17',NULL,'anonymousUser','2017-04-16 18:34:17'),(18,'stefifm','$2a$10$VrkX.UMM9sY838V41tgK7.gY8noduqymOThzsocIyCzRoztTFfm5S','Stefania','Bruera','bruerastefania@gmail.com','http://pbs.twimg.com/profile_images/820667428904562689/lBvzFWCp_normal.jpg','','en',NULL,NULL,'anonymousUser','2017-04-16 18:48:52',NULL,'anonymousUser','2017-04-16 18:48:52'),(19,'joseantonio_gl','$2a$10$RvoyT0ZkjFAxEG6ZAFqpo.WVpg9ujwzXWtlgXURzTKKz6Q7lqKazq','José','Glez.','antoniogonluen@hotmail.com','http://pbs.twimg.com/profile_images/817769158347816960/aJvL0vXo_normal.jpg','','en',NULL,NULL,'anonymousUser','2017-04-16 19:00:49',NULL,'anonymousUser','2017-04-16 19:00:49'),(20,'pdeory','$2a$10$PXcixVeCm9wcwOqfds13hOusdiLu8dqt3UR5OXLwPbBmTHBgA8loi','Pabl0',NULL,'pablodeory98@gmail.com','http://pbs.twimg.com/profile_images/817695831629434881/Y9yQXFkn_normal.jpg','','en',NULL,NULL,'anonymousUser','2017-04-16 19:08:00',NULL,'anonymousUser','2017-04-16 19:08:00'),(21,'abf1_','$2a$10$gBM4zXC.Ukb7K4zD/B/NjO7TkzFLWBoeLjSkF5F9ods0A78C7A8fK','Ringmeister',NULL,'adbema-12@hotmail.es','http://pbs.twimg.com/profile_images/839598266694127616/g_Lrisp3_normal.jpg','','en',NULL,NULL,'anonymousUser','2017-04-16 19:11:56',NULL,'anonymousUser','2017-04-16 19:11:56'),(22,'tfinishline_','$2a$10$fYbtms8x0npSmt0UmjUZyOQ5HNCaIgUeHYmAYecWhZH8Du4wwB7eG','The','Line','blogdemotorsports@gmail.com','http://pbs.twimg.com/profile_images/839770908243947520/DlaY_YpG_normal.jpg','','en',NULL,NULL,'anonymousUser','2017-04-17 20:54:32',NULL,'anonymousUser','2017-04-17 20:54:32'),(23,'efeuno','$2a$10$H4jXWZYDnKr09yBCLRCJiewS3sofS9cVmg6UuiGjR0bcrt5pnCiZO',NULL,NULL,'f1infoyt@gmail.com',NULL,'','es',NULL,NULL,'anonymousUser','2017-05-10 18:47:59',NULL,'anonymousUser','2017-05-10 18:51:19'),(24,'marcotef1','$2a$10$9vkqAcNvtvCh6s5zlPBPl.VI/6.TlLEPNFArF8xLh4zxYu5s7ToGe',NULL,NULL,'xosemarcote@gmail.com',NULL,'\0','es','89236387174161783815',NULL,'anonymousUser','2017-05-10 19:02:59',NULL,'anonymousUser','2017-05-10 19:02:59'),(25,'albertfont','$2a$10$JwEVXS.BxTGeUmv/npmBPeRwtTdNpNXJsMcgKLprq5K6NDt2qHM66',NULL,NULL,'albert@font.cat',NULL,'','ca',NULL,NULL,'anonymousUser','2017-05-11 14:46:21',NULL,'anonymousUser','2017-05-11 14:48:51');
/*!40000 ALTER TABLE `jhi_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jhi_user_authority`
--

DROP TABLE IF EXISTS `jhi_user_authority`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jhi_user_authority` (
  `user_id` bigint(20) NOT NULL,
  `authority_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`,`authority_name`),
  KEY `fk_authority_name` (`authority_name`),
  CONSTRAINT `FK290okww5jujghp4el5i7mgwu0` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`),
  CONSTRAINT `FK4psxl0jtx6nr7rhqbynr6itoc` FOREIGN KEY (`authority_name`) REFERENCES `jhi_authority` (`name`),
  CONSTRAINT `fk_authority_name` FOREIGN KEY (`authority_name`) REFERENCES `jhi_authority` (`name`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jhi_user_authority`
--

LOCK TABLES `jhi_user_authority` WRITE;
/*!40000 ALTER TABLE `jhi_user_authority` DISABLE KEYS */;
INSERT INTO `jhi_user_authority` VALUES (1,'ROLE_ADMIN'),(3,'ROLE_ADMIN'),(8,'ROLE_EDITOR'),(10,'ROLE_EDITOR'),(11,'ROLE_EDITOR'),(12,'ROLE_EDITOR'),(14,'ROLE_EDITOR'),(15,'ROLE_EDITOR'),(1,'ROLE_USER'),(3,'ROLE_USER'),(8,'ROLE_USER'),(10,'ROLE_USER'),(11,'ROLE_USER'),(12,'ROLE_USER'),(14,'ROLE_USER'),(15,'ROLE_USER'),(16,'ROLE_USER'),(17,'ROLE_USER'),(18,'ROLE_USER'),(19,'ROLE_USER'),(20,'ROLE_USER'),(21,'ROLE_USER'),(22,'ROLE_USER'),(23,'ROLE_USER'),(24,'ROLE_USER'),(25,'ROLE_USER');
/*!40000 ALTER TABLE `jhi_user_authority` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `points_system`
--

DROP TABLE IF EXISTS `points_system`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `points_system` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `points` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `points_most_lead_laps` int(11) DEFAULT NULL,
  `points_fast_lap` int(11) DEFAULT NULL,
  `points_pole` int(11) DEFAULT NULL,
  `points_lead_lap` int(11) DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `points_system`
--

LOCK TABLES `points_system` WRITE;
/*!40000 ALTER TABLE `points_system` DISABLE KEYS */;
INSERT INTO `points_system` VALUES (1,'FIA Top 10, 25 for winner',NULL,'25, 18, 15, 12, 10, 8, 6, 4, 2, 1',0,0,0,0,'','system','2017-05-11 11:55:54','iclavijos','2017-05-11 11:55:54');
/*!40000 ALTER TABLE `points_system` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `racetrack`
--

DROP TABLE IF EXISTS `racetrack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `racetrack` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `location` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `logo_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `racetrack`
--

LOCK TABLES `racetrack` WRITE;
/*!40000 ALTER TABLE `racetrack` DISABLE KEYS */;
INSERT INTO `racetrack` VALUES (1,'Circuit de Spa-Francorchamps','Stavelot, Belgium','https://res.cloudinary.com/msdb-cloud/image/upload/v1489675520/racetrack/1.png','system','2017-03-01 00:00:00',NULL,NULL),(2,'Valencia Street Circuit','Valencia, Spain','https://res.cloudinary.com/msdb-cloud/image/upload/v1489675692/racetrack/2.jpg','system','2017-03-01 00:00:00',NULL,NULL),(3,'Circuit Gilles Villeneuve','Montreal, Canada',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(4,'Autodromo Nazionale Monza','Monza, Italy','https://res.cloudinary.com/msdb-cloud/image/upload/v1489675533/racetrack/4.jpg','system','2017-03-01 00:00:00',NULL,NULL),(5,'Mount Panorama Circuit','Bathurst, Australia',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(6,'Suzuka Circuit','Suzuka, Japan','https://res.cloudinary.com/msdb-cloud/image/upload/v1489675641/racetrack/6.png','system','2017-03-01 00:00:00',NULL,NULL),(7,'Daytona International Speedway','Daytona Beach, USA','https://res.cloudinary.com/msdb-cloud/image/upload/v1489567478/racetrack/7.png','system','2017-03-01 00:00:00',NULL,NULL),(13,'Guia Circuit','Macau, China',NULL,'iclavijos','2017-03-30 10:38:20','iclavijos','2017-03-30 10:38:20'),(14,'Circuit de la Sarthe','Le Mans, France','https://res.cloudinary.com/msdb-cloud/image/upload/v1490626510/racetrack/14.png','admin','2017-03-27 16:55:36','admin','2017-03-27 16:55:38'),(15,'Baku City Circuit','Baku, Azerbaijan',NULL,'admin','2017-04-04 12:06:35','admin','2017-04-04 12:06:35'),(17,'Nürburgring','Nürburg, Germany',NULL,'admin','2017-04-04 13:02:58','admin','2017-04-04 13:02:58'),(18,'Merlbourne Grand Prix Circuit','Merlbourne, Australia',NULL,'admin','2017-04-16 12:16:11','admin','2017-04-16 12:16:11'),(19,'Bahrain International Circuit','Sakhir, Bahrain','https://res.cloudinary.com/msdb-cloud/image/upload/v1492364788/racetrack/19.png','admin','2017-04-16 17:46:28','admin','2017-04-16 17:46:29'),(20,'Shangai International Circuit','Jiading, China',NULL,'iclavijos','2017-04-25 05:41:47','iclavijos','2017-04-25 05:41:47'),(21,'Sochi Autodrom','Sochi, Russia','https://res.cloudinary.com/msdb-cloud/image/upload/v1493357309/racetrack/21.png','admin','2017-04-28 05:28:29','admin','2017-04-28 05:28:31'),(22,'Indianapolis Motor Speedway','Speedway, USA','https://res.cloudinary.com/msdb-cloud/image/upload/v1493359988/racetrack/22.png','admin','2017-04-28 06:13:06','admin','2017-04-28 06:13:09'),(23,'Circuit de Barcelona - Catalunya','Montmeló, Spain','https://res.cloudinary.com/msdb-cloud/image/upload/v1494324508/racetrack/23.jpg','admin','2017-05-09 12:08:27','admin','2017-05-09 12:08:28');
/*!40000 ALTER TABLE `racetrack` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `racetrack_layout`
--

DROP TABLE IF EXISTS `racetrack_layout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `racetrack_layout` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `length` int(11) NOT NULL,
  `year_first_use` int(11) NOT NULL,
  `racetrack_id` bigint(20) DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  `layout_image_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_racetrack_layout_racetrack_id` (`racetrack_id`),
  CONSTRAINT `FKiaransegncg19amgka3p9sqim` FOREIGN KEY (`racetrack_id`) REFERENCES `racetrack` (`id`),
  CONSTRAINT `fk_racetrack_layout_racetrack_id` FOREIGN KEY (`racetrack_id`) REFERENCES `racetrack` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `racetrack_layout`
--

LOCK TABLES `racetrack_layout` WRITE;
/*!40000 ALTER TABLE `racetrack_layout` DISABLE KEYS */;
INSERT INTO `racetrack_layout` VALUES (1,'Modern circuit - new pitlane and bus stop chicane',7004,2007,1,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1488973890/racetrackLayout/1.png','system','2017-04-07 09:36:57','iclavijos','2017-04-07 09:36:59'),(2,'Modern circuit - modified Bus stop chicane',6976,2004,1,'\0',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(3,'Modern Circuit With Chicane at Eau Rouge',7001,1994,1,'\0',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(4,'Modern Circuit With Original Bus Stop Chicane',6968,1981,1,'\0','https://res.cloudinary.com/msdb-cloud/image/upload/v1491557844/racetrackLayout/4.jpg','system','2017-04-07 09:37:23','iclavijos','2017-04-07 09:37:25'),(5,'Old circuit',14100,1947,1,'\0',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(6,'Original pre-War Circuit',14900,1921,1,'\0',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(7,'GP Circuit',4361,1978,3,'',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(8,'Modern Grand Prix Circuit',5793,2000,4,'',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(9,'Oval',4250,1922,4,'\0',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(10,'Junior Course',2405,2000,4,'',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(11,'Combined Course',10000,1922,4,'\0',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(12,'The Mountain',6213,1938,5,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1489567781/racetrackLayout/12.jpg','system','2017-03-01 00:00:00',NULL,NULL),(13,'Grand Prix circuit',5807,2003,6,'',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(14,'Motorcycle Grand Prix circuit',5821,2004,6,'',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(15,'East circuit',2243,2003,6,'',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(16,'West circuit',3466,2003,6,'',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(17,'Original circuit',6004,1962,6,'\0',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(19,'Modern Circuit With Modified Bus Stop Chicane',6976,2004,1,'\0',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(20,'Original pre-War',14900,1921,1,'\0',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(21,'Nascar Tri Oval',4000,1959,7,'',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(22,'Sports Car Course',5730,1985,7,'',NULL,'system','2017-03-01 00:00:00',NULL,NULL),(37,'Grand Prix Layout',6200,1967,13,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1490870344/racetrackLayout/23.png','iclavijos','2017-03-30 10:39:04','iclavijos','2017-03-30 10:39:05'),(43,'Circuit Nº14',13629,2007,14,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1490627046/racetrackLayout/43.png','admin','2017-03-27 17:04:31','admin','2017-03-27 17:04:34'),(45,'Grand prix layout',6003,2016,15,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1491300456/racetrackLayout/45.png','admin','2017-04-04 12:08:09','admin','2017-04-04 12:08:12'),(46,'Grand prix layout',5419,2008,2,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1491300641/racetrackLayout/46.png','admin','2017-04-04 12:11:14','admin','2017-04-04 12:11:16'),(47,'GP Strecke',5148,2002,17,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1491303841/racetrackLayout/47.png','admin','2017-04-04 13:04:34','admin','2017-04-04 13:04:36'),(48,'Grand Prix layout',5027,1953,18,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1492344964/racetrackLayout/48.png','admin','2017-04-16 12:16:04','admin','2017-04-16 12:16:05'),(49,'Original layout',5417,2004,19,'\0',NULL,'admin','2017-04-16 17:48:08','admin','2017-04-16 17:48:08'),(50,'Endurance Circuit',6299,2010,19,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1492364917/racetrackLayout/50.png','admin','2017-04-16 17:48:37','admin','2017-04-16 17:48:38'),(51,'Grand Prix Circuit',5412,2005,19,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1492364951/racetrackLayout/51.png','admin','2017-04-16 17:49:10','admin','2017-04-16 17:49:12'),(52,'Grand Prix layout',5451,2004,20,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1493099012/racetrackLayout/52.png','iclavijos','2017-04-25 05:43:32','iclavijos','2017-04-25 05:43:33'),(53,'Grand Prix circuit',5848,2014,21,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1493357407/racetrackLayout/53.png','admin','2017-04-28 05:30:07','admin','2017-04-28 05:30:08'),(54,'Rectangular Oval track',4023,1909,22,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1493360559/racetrackLayout/54.jpg','admin','2017-04-28 06:22:39','admin','2017-04-28 06:22:40'),(55,'Grand Prix Layout',4655,2007,23,'','https://res.cloudinary.com/msdb-cloud/image/upload/v1494324573/racetrackLayout/55.png','admin','2017-05-09 12:09:32','admin','2017-05-09 12:09:33');
/*!40000 ALTER TABLE `racetrack_layout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `series`
--

DROP TABLE IF EXISTS `series`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `series` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `shortname` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `organizer` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `logo_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `series`
--

LOCK TABLES `series` WRITE;
/*!40000 ALTER TABLE `series` DISABLE KEYS */;
INSERT INTO `series` VALUES (1,'FIA World Endurance Championship','FIA WEC','FIA ','https://res.cloudinary.com/msdb-cloud/image/upload/v1492376685/series/1.png','oscargarcia','2017-04-16 21:04:44','oscargarcia','2017-04-16 21:04:45'),(2,'Monster Energy NASCAR Cup Series','NASCAR Cup','NASCAR','https://res.cloudinary.com/msdb-cloud/image/upload/v1494441471/series/2.png','pontonesms','2017-05-10 20:37:50','pontonesms','2017-05-10 20:37:51'),(3,'FIA Formula 1 World championship','F1','FIA','https://res.cloudinary.com/msdb-cloud/image/upload/v1494480552/series/3.png','admin','2017-05-11 07:29:12','admin','2017-05-11 07:29:12');
/*!40000 ALTER TABLE `series` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `series_edition`
--

DROP TABLE IF EXISTS `series_edition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `series_edition` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `period` varchar(10) NOT NULL,
  `single_chassis` bit(1) DEFAULT NULL,
  `single_engine` bit(1) DEFAULT NULL,
  `single_tyre` bit(1) DEFAULT NULL,
  `allowed_categories_id` bigint(20) DEFAULT NULL,
  `series_id` bigint(20) DEFAULT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmucx0ci2ehufhba1sk6f6w8r7` (`allowed_categories_id`),
  KEY `FKdytk23q0b1i6d4wowqq1dgpjr` (`series_id`),
  CONSTRAINT `FKdytk23q0b1i6d4wowqq1dgpjr` FOREIGN KEY (`series_id`) REFERENCES `series` (`id`),
  CONSTRAINT `FKmucx0ci2ehufhba1sk6f6w8r7` FOREIGN KEY (`allowed_categories_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `series_edition`
--

LOCK TABLES `series_edition` WRITE;
/*!40000 ALTER TABLE `series_edition` DISABLE KEYS */;
/*!40000 ALTER TABLE `series_edition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `hq_location` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `logo_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (1,'McLaren Racing Limited',NULL,'Woking, UK','https://res.cloudinary.com/msdb-cloud/image/upload/v1489567860/team/1.png','system','2017-03-01 00:00:00',NULL,NULL),(2,'Ferrari',NULL,'Modena, Italy','https://res.cloudinary.com/msdb-cloud/image/upload/v1489589812/team/2.jpg','system','2017-03-01 00:00:00',NULL,NULL),(3,'Team Lotus',NULL,'Hethel, United Kingdom','https://res.cloudinary.com/msdb-cloud/image/upload/v1489589891/team/3.png','system','2017-03-01 00:00:00',NULL,NULL),(4,'Van Amersfoort Racing','','Huizen, Netherlands',NULL,'iclavijos','2017-04-07 09:43:56','iclavijos','2017-04-07 09:43:56'),(5,'Carlin Motorsport','','Farnham, UK',NULL,'iclavijos','2017-04-07 09:43:56','iclavijos','2017-04-07 09:43:56'),(6,'Prema Powerteam','','Grisignano di Zocco, Italy',NULL,'iclavijos','2017-04-07 09:43:56','iclavijos','2017-04-07 09:43:56'),(7,'Double R Racing','','Woking, UK',NULL,'iclavijos','2017-04-07 09:43:56','iclavijos','2017-04-07 09:43:56'),(8,'Mücke Motorsport','','Berlin, Germany',NULL,'iclavijos','2017-04-07 09:43:56','iclavijos','2017-04-07 09:43:56'),(9,'Fortec Motorsport','','Daventry, UK',NULL,'iclavijos','2017-04-07 09:43:56','iclavijos','2017-04-07 09:43:56'),(10,'Motopark Academy','','Oschersleben, Germany',NULL,'iclavijos','2017-04-07 09:43:56','iclavijos','2017-04-07 09:43:56'),(11,'Toda Racing','','Okayama, Japan',NULL,'iclavijos','2017-04-07 09:43:56','iclavijos','2017-04-07 09:43:56'),(12,'TOM\'S','','Setagaya, Japan',NULL,'iclavijos','2017-04-07 09:43:56','iclavijos','2017-04-07 09:43:56'),(13,'Threebond with T-Sport','','Brackley, UK',NULL,'iclavijos','2017-04-07 09:43:56','iclavijos','2017-04-07 09:43:56'),(14,'B-MAX Racing Team','','Kanagawa, Japan',NULL,'iclavijos','2017-04-07 09:43:56','iclavijos','2017-04-07 09:43:56'),(15,'Force India',NULL,'Silverstone, UK','https://res.cloudinary.com/msdb-cloud/image/upload/v1492344242/team/15.png','admin','2017-04-16 12:04:02','admin','2017-04-16 12:04:03'),(16,'Haas',NULL,'Kannapolis, USA',NULL,'admin','2017-04-16 12:06:19','admin','2017-04-16 12:06:19'),(17,'Red Bull Racing',NULL,'Milton Keynes','https://res.cloudinary.com/msdb-cloud/image/upload/v1492344459/team/17.png','admin','2017-04-16 12:07:39','admin','2017-04-16 12:07:39'),(18,'Renault',NULL,'Viry Chatillon, France','https://res.cloudinary.com/msdb-cloud/image/upload/v1492344583/team/18.png','admin','2017-04-16 12:09:43','admin','2017-04-16 12:09:44'),(19,'Sauber',NULL,'Hinwill, Switzerland','https://res.cloudinary.com/msdb-cloud/image/upload/v1492344641/team/19.png','admin','2017-04-16 12:10:41','admin','2017-04-16 12:10:42'),(20,'Scuderia Toro Rosso',NULL,'Faenza, Italy','https://res.cloudinary.com/msdb-cloud/image/upload/v1492344688/team/20.png','admin','2017-04-16 12:11:28','admin','2017-04-16 12:11:29'),(21,'Williams Grand Prix Engineering',NULL,'Grove, UK','https://res.cloudinary.com/msdb-cloud/image/upload/v1492344810/team/21.jpg','admin','2017-04-16 12:13:30','admin','2017-04-16 12:13:31'),(22,'Mercedes Benz',NULL,'Stuttgart, Germany','https://res.cloudinary.com/msdb-cloud/image/upload/v1492345302/team/22.png','admin','2017-04-16 12:21:42','admin','2017-04-16 12:21:43'),(23,'ART Grand Prix',NULL,'Villeneuve-La-Guyard, France',NULL,'sergi14','2017-04-17 21:22:05','sergi14','2017-04-17 21:22:06'),(24,'Racing Engineering',NULL,'Sanlúcar de Barrameda, Spain',NULL,'sergi14','2017-04-17 21:22:48','sergi14','2017-04-17 21:22:48'),(25,'RUSSIAN TIME',NULL,'Snetterton, United Kingdom',NULL,'sergi14','2017-04-17 21:35:40','sergi14','2017-04-17 21:35:41'),(26,'DAMS',NULL,'Le Mans, France',NULL,'sergi14','2017-04-17 21:27:31','sergi14','2017-04-17 21:27:31'),(27,'Campos Racing',NULL,'Alzira, Spain',NULL,'sergi14','2017-04-17 21:29:03','sergi14','2017-04-17 21:29:03'),(28,'MP Motorsport',NULL,'Westmaas, Netherlands',NULL,'sergi14','2017-04-17 21:31:21','sergi14','2017-04-17 21:31:21'),(29,'Trident Racing',NULL,'Milano, Italy',NULL,'sergi14','2017-04-17 21:31:56','sergi14','2017-04-17 21:31:56'),(30,'Rapax',NULL,'Veggiano, Italy',NULL,'sergi14','2017-04-17 21:32:27','sergi14','2017-04-17 21:32:27'),(31,'Arden International',NULL,'Arden, United Kingdom',NULL,'sergi14','2017-04-17 21:35:58','sergi14','2017-04-17 21:35:58'),(32,'Andretti Autosport','Team originally created as Forsythe Green Racing','Indianapolis, USA','https://res.cloudinary.com/msdb-cloud/image/upload/v1493363154/team/32.png','admin','2017-04-28 07:05:54','admin','2017-04-28 07:05:56'),(33,'Michael Shank Racing',NULL,'Columbus, USA','https://res.cloudinary.com/msdb-cloud/image/upload/v1493363346/team/33.jpg','admin','2017-04-28 07:09:07','admin','2017-04-28 07:09:07'),(34,'Chip Ganassi Racing',NULL,'Indianapolis, USA','https://res.cloudinary.com/msdb-cloud/image/upload/v1493363466/team/34.png','admin','2017-04-28 07:11:06','admin','2017-04-28 07:11:06'),(35,'Dale Coyne Racing',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1493363514/team/35.png','admin','2017-04-28 07:11:54','admin','2017-04-28 07:11:55'),(36,'Dreyer & Reinbold Racing',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1493363584/team/36.png','admin','2017-04-28 07:13:04','admin','2017-04-28 07:13:05'),(37,'Ed Carpenter Racing',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1493363611/team/37.png','admin','2017-04-28 07:13:31','admin','2017-04-28 07:13:32'),(38,'Juncos Racing',NULL,NULL,'https://res.cloudinary.com/msdb-cloud/image/upload/v1493363665/team/38.png','admin','2017-04-28 07:14:25','admin','2017-04-28 07:14:26'),(39,'Lazier Burns Racing',NULL,NULL,NULL,'admin','2017-04-28 07:15:22','admin','2017-04-28 07:15:22'),(40,'Rahal Letterman Lanigan Racing',NULL,'Hilliard, USA','https://res.cloudinary.com/msdb-cloud/image/upload/v1493363845/team/40.png','admin','2017-04-28 07:17:25','admin','2017-04-28 07:17:26'),(41,'Schmidt Peterson Motorsports',NULL,'Indianapolis, USA','https://res.cloudinary.com/msdb-cloud/image/upload/v1493363918/team/41.png','admin','2017-04-28 07:18:38','admin','2017-04-28 07:18:39'),(42,'Team Penske',NULL,'Mooresville, USA','https://res.cloudinary.com/msdb-cloud/image/upload/v1493363996/team/42.png','admin','2017-04-28 07:19:56','admin','2017-04-28 07:19:57'),(43,'Joe Gibbs Racing',NULL,'Huntersville, USA',NULL,'pontonesms','2017-05-10 21:22:41','pontonesms','2017-05-10 21:22:41'),(44,'Hendrick Motorsports',NULL,'Concord, USA',NULL,'pontonesms','2017-05-10 21:23:59','pontonesms','2017-05-10 21:23:59'),(45,'Stewart-Haas Racing',NULL,'Kannapolis, USA',NULL,'pontonesms','2017-05-10 21:27:33','pontonesms','2017-05-10 21:27:33'),(46,'Richard Petty Motorsports',NULL,'Concord, USA',NULL,'pontonesms','2017-05-10 21:25:11','pontonesms','2017-05-10 21:25:11'),(47,'Wood Brothers Racing',NULL,'Stuart, USA',NULL,'pontonesms','2017-05-10 21:26:21','pontonesms','2017-05-10 21:26:21'),(48,'Furniture Row Racing',NULL,'Denver, USA',NULL,'pontonesms','2017-05-10 21:27:25','pontonesms','2017-05-10 21:27:26');
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_participations`
--

DROP TABLE IF EXISTS `team_participations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team_participations` (
  `participations_id` bigint(20) NOT NULL,
  `teams_id` bigint(20) NOT NULL,
  PRIMARY KEY (`teams_id`,`participations_id`),
  CONSTRAINT `fk_team_participations_teams_id` FOREIGN KEY (`teams_id`) REFERENCES `team` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_participations`
--

LOCK TABLES `team_participations` WRITE;
/*!40000 ALTER TABLE `team_participations` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_participations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tyre_provider`
--

DROP TABLE IF EXISTS `tyre_provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tyre_provider` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_by` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `last_modified_by` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_modified_date` datetime DEFAULT NULL,
  `logo_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tyre_provider`
--

LOCK TABLES `tyre_provider` WRITE;
/*!40000 ALTER TABLE `tyre_provider` DISABLE KEYS */;
INSERT INTO `tyre_provider` VALUES (3,'Pirelli','admin','2017-03-24 14:31:49','admin','2017-03-24 14:31:51','https://res.cloudinary.com/msdb-cloud/image/upload/v1490362278/tyreProvider/3.png'),(4,'Bridgestone','admin','2017-03-25 13:56:06','admin','2017-03-25 13:56:08','https://res.cloudinary.com/msdb-cloud/image/upload/v1490446534/tyreProvider/4.jpg'),(5,'Firestone','admin','2017-04-28 07:24:47','admin','2017-04-28 07:24:48','https://res.cloudinary.com/msdb-cloud/image/upload/v1493364287/tyreProvider/5.jpg'),(6,'Goodyear','pontonesms','2017-05-10 20:31:27','pontonesms','2017-05-10 20:31:28','https://res.cloudinary.com/msdb-cloud/image/upload/v1494441088/tyreProvider/6.png'),(7,'Hankook','pontonesms','2017-05-10 20:32:17','pontonesms','2017-05-10 20:32:18','https://res.cloudinary.com/msdb-cloud/image/upload/v1494441138/tyreProvider/7.png'),(8,'Cooper','pontonesms','2017-05-10 20:35:06','pontonesms','2017-05-10 20:35:07','https://res.cloudinary.com/msdb-cloud/image/upload/v1494441307/tyreProvider/8.png');
/*!40000 ALTER TABLE `tyre_provider` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-11 17:08:11
