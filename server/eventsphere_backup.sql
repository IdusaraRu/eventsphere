-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: eventsphere_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `approvals`
--

DROP TABLE IF EXISTS `approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `approvals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event` varchar(255) DEFAULT NULL,
  `organizer` varchar(255) DEFAULT NULL,
  `organizerPhone` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `startTime` varchar(255) DEFAULT NULL,
  `endTime` varchar(255) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `posterUrl` varchar(255) DEFAULT NULL,
  `createdAt` varchar(255) DEFAULT NULL,
  `adminNotes` text DEFAULT NULL,
  `createdByEmail` varchar(255) DEFAULT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
INSERT INTO `approvals` VALUES (1,'Welcome','Kavindu','0776254179','2026-02-19','12:48','14:49','Main Auditorium','Other','welcome','approved','data:image/jpeg;base64,/9j/4AAQSkZJRgABAQIAHAAcAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCADIAMgDASIAAhEB','2026-02-10T06:19:26.315Z',NULL,'kavindu@gmail.com','2026-02-10 06:20:05'),(2,'Installation','Idusara','0776254179','2026-02-26','04:53','05:53','Main Auditorium','Academic','\n\n65','approved','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAYAAABI4IyJAAAAAXNSR0IArs4c6QAAIABJREFUeF7sfQd4XcWV/+31dVV3GxtsTDNusixZVnORu2EdIIEENvxJSAgLyaZBSEiBBFI3WRLCQhIIbMg6gLFxk9UsS7blAgZTQndV1+vv9vLPuU8jP8myuo0B3+/TJ+m9mXvnzsxvTj8Hxy5cF2bgwgwMeAbwAbe80PDCD','2026-02-10T06:23:21.821Z',NULL,'kavindu@gmail.com','2026-02-10 06:24:37'),(3,'FOTS AGM','Ravija','0753321453','2026-02-25','13:01','17:01','TLH 1','Other','fots media','approved','http://localhost:3000/uploads/1770708725189.png','2026-02-10T07:32:05.204Z','idusara','r@gmail.com','2026-02-10 07:33:55'),(4,'AGM','Nirodha','0758855445','2026-02-27','13:06','17:06','Seminar Hall A','Academic','iiiiiiiiiiiiiiiiiiiiiii','approved','http://localhost:3000/uploads/1770709003642.jpg','2026-02-10T07:36:43.659Z','pila','r@gmail.com','2026-02-10 07:37:19');
/*!40000 ALTER TABLE `approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `startTime` varchar(255) DEFAULT NULL,
  `endTime` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `attendees` int(11) DEFAULT 0,
  `status` varchar(255) DEFAULT 'Upcoming',
  `imageGradient` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `organizer` varchar(255) DEFAULT NULL,
  `organizerPhone` varchar(255) DEFAULT NULL,
  `approvedBy` varchar(255) DEFAULT NULL,
  `approvalDate` varchar(255) DEFAULT NULL,
  `adminNotes` text DEFAULT NULL,
  `posterUrl` varchar(255) DEFAULT NULL,
  `createdByEmail` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Welcome','2026-02-19','12:48','14:49','Main Auditorium',0,'Upcoming','from-blue-500 to-indigo-600','Other','welcome','Kavindu','0776254179','Admin User','2026-02-10T06:20:05.859Z',NULL,'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQIAHAAcAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCADIAMgDASIAAhEB','kavindu@gmail.com','2026-02-10 06:20:05','2026-02-10 06:20:05'),(2,'Installation','2026-02-26','04:53','05:53','Main Auditorium',0,'Upcoming','from-blue-500 to-indigo-600','Academic','\n\n65','Idusara','0776254179','Admin User','2026-02-10T06:24:37.879Z',NULL,'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAYAAABI4IyJAAAAAXNSR0IArs4c6QAAIABJREFUeF7sfQd4XcWV/+31dVV3GxtsTDNusixZVnORu2EdIIEENvxJSAgLyaZBSEiBBFI3WRLCQhIIbMg6gLFxk9UsS7blAgZTQndV1+vv9vLPuU8jP8myuo0B3+/TJ+m9mXvnzsxvTj8Hxy5cF2bgwgwMeAbwAbe80PDCD','kavindu@gmail.com','2026-02-10 06:24:37','2026-02-10 06:24:37'),(3,'FOTS AGM','2026-02-25','13:01','17:01','TLH 1',0,'Upcoming','from-blue-500 to-indigo-600','Other','fots media','Ravija','0753321453','Admin User','2026-02-10T07:33:55.897Z','idusara','http://localhost:3000/uploads/1770708725189.png','r@gmail.com','2026-02-10 07:33:55','2026-02-10 07:33:55'),(4,'AGM','2026-02-27','13:06','17:06','Seminar Hall A',0,'Upcoming','from-blue-500 to-indigo-600','Academic','iiiiiiiiiiiiiiiiiiiiiii','Nirodha','0758855445','Senthuran','2026-02-10T07:37:19.855Z','pila','http://localhost:3000/uploads/1770709003642.jpg','r@gmail.com','2026-02-10 07:37:19','2026-02-10 07:37:19');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `occupation` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `lastLogin` varchar(255) DEFAULT NULL,
  `savedEventIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`savedEventIds`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@eventsphere.com','admin','approved','System Admin',NULL,'2/10/2026 1:08:15 PM','[]','2026-02-09 13:38:58','2026-02-10 07:38:15'),(2,'Student User','student@eventsphere.com','student','approved','Student',NULL,NULL,'[]','2026-02-09 13:38:58','2026-02-09 13:38:58'),(3,'Ravija','r@gmail.com','student','approved','','','2/10/2026 1:10:00 PM','[]','2026-02-10 07:19:46','2026-02-10 07:40:00'),(4,'Ravija','ravija@gmail.com','student','rejected','','',NULL,'[]','2026-02-10 07:19:58','2026-02-10 07:25:30'),(5,'Senthuran','v@gmail.com','faculty','approved','Dean','FOT','2/10/2026 1:06:57 PM','[]','2026-02-10 07:35:28','2026-02-10 07:36:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `venues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (1,'Main Auditorium',500,'2026-02-09 13:38:58','2026-02-09 13:38:58'),(2,'Seminar Hall A',100,'2026-02-09 13:38:58','2026-02-09 13:38:58'),(3,'Computer Lab 1',50,'2026-02-09 13:38:58','2026-02-09 13:38:58'),(4,'Open Ground',1000,'2026-02-09 13:38:58','2026-02-09 13:38:58'),(5,'TLH 1',150,'2026-02-09 14:01:05','2026-02-09 14:01:05'),(6,'Kuppi gaha',300,'2026-02-10 07:38:46','2026-02-10 07:38:46');
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-10 13:55:24
