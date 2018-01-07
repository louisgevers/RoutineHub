CREATE DATABASE  IF NOT EXISTS `routinehub` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `routinehub`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: routinehub
-- ------------------------------------------------------
-- Server version	5.7.20-log

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
-- Table structure for table `day_of_week`
--

DROP TABLE IF EXISTS `day_of_week`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `day_of_week` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `day_of_week`
--

LOCK TABLES `day_of_week` WRITE;
/*!40000 ALTER TABLE `day_of_week` DISABLE KEYS */;
INSERT INTO `day_of_week` VALUES (1,'MONDAY'),(2,'TUESDAY'),(3,'WEDNESDAY'),(4,'THURSDAY'),(5,'FRIDAY'),(6,'SATURDAY'),(7,'SUNDAY');
/*!40000 ALTER TABLE `day_of_week` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `difficulty`
--

DROP TABLE IF EXISTS `difficulty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `difficulty` (
  `id` int(11) NOT NULL,
  `name` text,
  PRIMARY KEY (`id`),
  CONSTRAINT `difficulty_ibfk_1` FOREIGN KEY (`id`) REFERENCES `habit` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `difficulty`
--

LOCK TABLES `difficulty` WRITE;
/*!40000 ALTER TABLE `difficulty` DISABLE KEYS */;
INSERT INTO `difficulty` VALUES (1,'bad'),(2,'easy'),(3,'medium'),(4,'hard');
/*!40000 ALTER TABLE `difficulty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goal`
--

DROP TABLE IF EXISTS `goal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `goal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text,
  `category` varchar(45) DEFAULT NULL,
  `highscore` int(11) DEFAULT NULL,
  `owner` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `habit_list_user_idx` (`owner`),
  CONSTRAINT `habit_list_user` FOREIGN KEY (`owner`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goal`
--

LOCK TABLES `goal` WRITE;
/*!40000 ALTER TABLE `goal` DISABLE KEYS */;
INSERT INTO `goal` VALUES (1,'More family time','Family',NULL,1),(2,'More work time','Work',NULL,1),(3,'More hobby time','Hobby',NULL,2),(4,'More personal time','Personal',NULL,2);
/*!40000 ALTER TABLE `goal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habit`
--

DROP TABLE IF EXISTS `habit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `habit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `notes` text,
  `difficulty_id` int(11) DEFAULT NULL,
  `goal_id` int(11) DEFAULT NULL,
  `highscore` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `habit_habit_list_idx` (`goal_id`),
  CONSTRAINT `habit_habit_list` FOREIGN KEY (`goal_id`) REFERENCES `goal` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habit`
--

LOCK TABLES `habit` WRITE;
/*!40000 ALTER TABLE `habit` DISABLE KEYS */;
INSERT INTO `habit` VALUES (1,'Pay Bills',NULL,2,4,NULL),(2,'Tidy up',NULL,3,4,NULL),(3,'Go to sleep before 10:30',NULL,3,4,NULL),(4,'Meditate',NULL,3,4,NULL),(5,'Draw',NULL,2,3,NULL),(6,'Call mom',NULL,2,1,NULL),(7,'Floss',NULL,3,4,NULL),(8,'Finish Homework',NULL,4,2,NULL),(9,'Go to sleep before 1:00',NULL,2,4,NULL),(10,'Exercise',NULL,4,4,NULL),(11,'Practice music instrument',NULL,4,3,NULL),(12,'Take nature pictures',NULL,3,3,NULL),(13,'Visit relatives',NULL,3,1,NULL);
/*!40000 ALTER TABLE `habit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habit_day_of_week`
--

DROP TABLE IF EXISTS `habit_day_of_week`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `habit_day_of_week` (
  `habit_id` int(11) NOT NULL,
  `day_of_week_id` int(11) NOT NULL,
  PRIMARY KEY (`habit_id`,`day_of_week_id`),
  KEY `weekday_idx` (`day_of_week_id`),
  CONSTRAINT `habit_day_of_week_day_of_week` FOREIGN KEY (`day_of_week_id`) REFERENCES `day_of_week` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `habit_day_of_week_habit` FOREIGN KEY (`habit_id`) REFERENCES `habit` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habit_day_of_week`
--

LOCK TABLES `habit_day_of_week` WRITE;
/*!40000 ALTER TABLE `habit_day_of_week` DISABLE KEYS */;
INSERT INTO `habit_day_of_week` VALUES (3,1),(4,1),(8,1),(3,2),(8,2),(3,3),(4,3),(8,3),(3,4),(8,4),(4,5),(8,5),(9,5),(4,6),(9,6),(3,7),(4,7);
/*!40000 ALTER TABLE `habit_day_of_week` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habit_done`
--

DROP TABLE IF EXISTS `habit_done`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `habit_done` (
  `habit_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`habit_id`,`timestamp`),
  CONSTRAINT `habit_done_habit` FOREIGN KEY (`habit_id`) REFERENCES `habit` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habit_done`
--

LOCK TABLES `habit_done` WRITE;
/*!40000 ALTER TABLE `habit_done` DISABLE KEYS */;
INSERT INTO `habit_done` VALUES (1,'2017-10-02 22:20:39'),(1,'2017-10-06 02:31:12'),(1,'2017-10-17 18:34:04'),(1,'2017-10-24 15:18:45'),(1,'2017-10-25 01:51:34'),(2,'2017-10-01 07:21:35'),(2,'2017-10-02 13:10:15'),(2,'2017-10-05 20:51:30'),(2,'2017-10-06 16:43:44'),(2,'2017-10-08 22:03:10'),(2,'2017-10-11 19:06:38'),(2,'2017-10-13 05:20:42'),(2,'2017-10-14 18:24:38'),(2,'2017-10-17 06:01:02'),(2,'2017-10-19 01:52:19'),(2,'2017-10-21 15:17:28'),(2,'2017-10-23 01:49:25'),(2,'2017-10-24 13:14:40'),(2,'2017-10-25 17:46:07'),(2,'2017-10-29 01:07:33'),(2,'2017-10-30 23:19:25'),(3,'2017-10-01 19:15:26'),(3,'2017-10-03 08:19:56'),(3,'2017-10-04 06:47:24'),(3,'2017-10-05 11:02:12'),(3,'2017-10-10 17:50:49'),(3,'2017-10-11 03:03:28'),(3,'2017-10-12 17:45:54'),(3,'2017-10-15 04:36:05'),(3,'2017-10-16 21:45:46'),(3,'2017-10-16 23:00:36'),(3,'2017-10-18 07:43:42'),(3,'2017-10-19 16:38:42'),(3,'2017-10-22 15:02:26'),(3,'2017-10-24 06:14:05'),(3,'2017-10-25 12:04:07'),(3,'2017-10-26 18:39:19'),(3,'2017-10-30 12:04:16'),(3,'2017-10-31 05:24:23'),(4,'2017-10-01 11:47:10'),(4,'2017-10-02 00:46:38'),(4,'2017-10-04 19:27:41'),(4,'2017-10-06 22:00:32'),(4,'2017-10-08 08:38:36'),(4,'2017-10-11 02:10:24'),(4,'2017-10-13 11:55:15'),(4,'2017-10-18 02:09:04'),(4,'2017-10-29 06:58:35'),(4,'2017-10-30 00:24:41'),(4,'2017-10-31 07:06:42'),(5,'2017-10-03 12:21:29'),(5,'2017-10-14 19:25:17'),(5,'2017-10-20 13:04:01'),(5,'2017-10-23 12:07:11'),(6,'2017-10-07 01:22:56'),(7,'2017-10-01 18:28:07'),(7,'2017-10-02 19:16:48'),(7,'2017-10-03 18:57:40'),(7,'2017-10-04 11:58:56'),(7,'2017-10-05 03:59:42'),(7,'2017-10-06 09:01:42'),(7,'2017-10-07 16:10:22'),(7,'2017-10-08 07:46:45'),(7,'2017-10-11 11:20:41'),(7,'2017-10-12 15:23:11'),(7,'2017-10-13 18:54:52'),(7,'2017-10-14 00:21:46'),(7,'2017-10-15 20:03:16'),(7,'2017-10-17 09:13:02'),(7,'2017-10-19 10:56:23'),(7,'2017-10-20 03:00:48'),(7,'2017-10-21 10:14:54'),(7,'2017-10-22 19:12:03'),(7,'2017-10-22 22:19:37'),(7,'2017-10-24 05:00:54'),(7,'2017-10-25 10:01:40'),(7,'2017-10-27 12:06:37'),(7,'2017-10-29 12:28:06'),(7,'2017-10-31 21:02:38'),(8,'2017-10-01 23:49:53'),(8,'2017-10-03 10:58:33'),(8,'2017-10-04 07:22:06'),(8,'2017-10-05 06:56:52'),(8,'2017-10-09 13:36:02'),(8,'2017-10-10 02:10:36'),(8,'2017-10-11 20:06:54'),(8,'2017-10-12 02:58:44'),(8,'2017-10-13 01:32:56'),(8,'2017-10-18 02:48:29'),(8,'2017-10-19 10:23:36'),(8,'2017-10-19 23:31:36'),(8,'2017-10-23 15:28:10'),(8,'2017-10-26 10:49:04'),(8,'2017-10-27 06:41:50'),(8,'2017-10-30 04:58:59'),(8,'2017-10-31 00:46:24'),(9,'2017-10-06 12:57:04'),(9,'2017-10-13 17:28:07'),(9,'2017-10-14 02:27:24'),(9,'2017-10-20 13:55:41'),(9,'2017-10-28 11:11:11'),(10,'2017-10-07 21:13:56'),(10,'2017-10-08 01:30:05'),(10,'2017-10-10 17:51:36'),(10,'2017-10-12 14:49:47'),(10,'2017-10-13 18:29:09'),(10,'2017-10-15 05:01:25'),(10,'2017-10-16 23:37:38'),(10,'2017-10-18 03:03:56'),(10,'2017-10-21 00:26:45'),(10,'2017-10-25 14:00:58'),(10,'2017-10-26 02:42:37'),(10,'2017-10-28 19:31:13'),(10,'2017-10-31 21:30:11'),(11,'2017-09-30 22:57:19'),(11,'2017-10-07 03:14:00'),(11,'2017-10-13 23:19:03'),(11,'2017-10-29 14:56:18'),(12,'2017-10-07 23:41:21');
/*!40000 ALTER TABLE `habit_done` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `username` tinytext NOT NULL,
  `password` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'user1','user1@habittracker.net','user1','pass1'),(2,'user2','user2@habittracker.net','user2','pass2');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-01-07 21:18:40
