/*
SQLyog Community v13.1.2 (64 bit)
MySQL - 5.7.27 : Database - fs-dev
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`fs-dev` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `fs-dev`;

/*Table structure for table `address` */

DROP TABLE IF EXISTS `address`;

CREATE TABLE `address` (
  `address_id` int(11) NOT NULL AUTO_INCREMENT,
  `place` varchar(100) NOT NULL COMMENT 'like line one & line two',
  `district` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `pin_code` varchar(10) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  `uuid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;

/*Data for the table `address` */

insert  into `address`(`address_id`,`place`,`district`,`state`,`country`,`pin_code`,`created_at`,`updated_at`,`isActive`,`uuid`) values 
(11,'#1293, 9th Main, 4th Cross, Jayanagar','Bangalore South','Karnataka','India','562209','2020-04-19 09:59:58','2020-04-19 09:59:58',1,'fe92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(15,'#1293, 9th Main, 4th Cross, Jayanagar','Bangalore South','Karnataka','India','562209','2020-04-19 10:09:33','2020-04-19 10:09:33',1,'fe92d4004b9f1edef174a70e820dd012cb5691e833m7u83e4rfgt5678yui958c'),
(25,'#1293, 9th Main, 4th Cross, Jayanagar','Bangalore South','Karnataka','India','562209','2020-04-19 16:40:07','2020-04-19 16:40:07',1,'m09id4004b9f1edef174a70e820dd012cb5691e833m7u83e4rfgt5678yui958c');

/*Table structure for table `authentication` */

DROP TABLE IF EXISTS `authentication`;

CREATE TABLE `authentication` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `password` varchar(64) NOT NULL COMMENT 'SHA256 Hash String',
  `salt` varchar(100) NOT NULL COMMENT 'Random String',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authentication_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=209 DEFAULT CHARSET=utf8;

/*Data for the table `authentication` */

insert  into `authentication`(`id`,`user_id`,`password`,`salt`,`created_at`,`updated_at`,`isActive`) values 
(11,25,'0dd5b35f4a8dbb6b07977ee03c37ad638ba1d82dc8569f8784112f98da9bb32d','ZqR5Twp4obBeUZ4An6ubpFUcAWn4wfw3TPodXgt4aMA=','2020-04-21 13:31:40','2020-04-21 13:31:40',1),
(37,76,'42854d5f80250ab248b418b579527ddedae892e4a7cab610ddab88c05495ae95','cqLt/uMloi+ApxLiF+x/XeOqmo9IgezJrivvwC8eLNI=','2020-04-28 05:22:03','2020-04-28 06:46:22',1),
(55,103,'6258dc2fe22a8b6de3b816dc2422607ed81360578eaa77aba1e44932422f6bbc','m0UbnLHZXq7BVjGa+a2irgxsAlng9LG7Kox6yZkxSos=','2020-05-18 11:02:26','2020-05-18 11:02:26',1),
(61,112,'251e848fa60ef90d16532aec9bd2eace2c3fbdefcfb1100ccd344bf9958904c3','yyGlROSBBq+5tW8ZVMfc5vTHi4VyEwLw+zwnIpAPgls=','2020-05-25 15:33:37','2020-05-25 15:33:37',1),
(153,80,'722e25ddfafb718d9424085aa33a98111b25c1096e2bc5819d376b4f9adf2a18','N//ZN3JwI3XhyTerqV6PFpx+huYr3rUJm1WndKtLCGk=','2020-06-11 16:08:51','2020-06-11 16:08:51',1),
(192,557,'5bc521857929c2feffce4fcac299b4903e412fabfd394e0044a1352122de2f77','0EYfWaHmC3+wtbjOqYY9PqPlxJ2YH3BrsXodHAE/AOc=','2020-06-26 13:33:06','2020-06-26 13:33:06',1),
(197,563,'d70fe0609ef2cdaeda6321cc154acbd9e712f8b1eced49a1cfd222111e8f7167','GzEtP89dlXPv0T+U1dx4LbNpqDWNhE6PrfKtLwoqTGs=','2020-06-26 13:54:41','2020-06-26 13:54:41',1),
(198,564,'0fd4a1825a5db9cb459bbf3c2d3707b772c7a3bfc7529fee848597a1259d3568','vI50PTUtciQvP0stk42rJcGQVq5GPDWOrxAfxuq4L68=','2020-06-26 13:57:37','2020-06-26 13:57:37',1),
(199,565,'0fd4a1825a5db9cb459bbf3c2d3707b772c7a3bfc7529fee848597a1259d3568','vI50PTUtciQvP0stk42rJcGQVq5GPDWOrxAfxuq4L68=','2020-06-26 13:58:32','2020-06-26 13:58:32',1),
(200,566,'c40ece9de27d8fed795c48d511130e83b10cd3cdbc9691fb883dc3981b8f0b62','7ErZyorOdLJXWuR+JTVjCLS70HR1dRGgq1NJm/73Dqo=','2020-06-27 11:28:02','2020-06-27 11:28:02',1),
(201,567,'edbb91d10ccb45095d44a12d492b0402dacf07a9af61668cb9e629fa7c8a8b89','Ye0uJUI9Vd0k8lrw8aM3miP+fQOuQegUnp3SvvPjuIU=','2020-06-27 13:59:58','2020-06-27 13:59:58',1),
(202,568,'edbb91d10ccb45095d44a12d492b0402dacf07a9af61668cb9e629fa7c8a8b89','Ye0uJUI9Vd0k8lrw8aM3miP+fQOuQegUnp3SvvPjuIU=','2020-06-27 14:03:53','2020-06-27 14:03:53',1),
(203,569,'edbb91d10ccb45095d44a12d492b0402dacf07a9af61668cb9e629fa7c8a8b89','Ye0uJUI9Vd0k8lrw8aM3miP+fQOuQegUnp3SvvPjuIU=','2020-06-27 14:12:19','2020-06-27 14:12:19',1),
(204,45,'811c88d47025c8a5579fb9ab0235f995fe73db4b35f6ffdd52dfb5adf8d4e679','J/X47K/UJxaXTT1DFjmGdl4vMJViDgrTBs6FDknS+qs=','2020-06-28 06:53:11','2020-06-28 06:53:11',1),
(206,620,'ddf60ed6e1b17d0055465567c3a66c627a62ce8cd460d3da1d23bebd18ca4928','YelHMXrVUcd9vds4pUR5ag2vvbSpKRpxYApnbO31Q4g=','2020-07-04 10:03:29','2020-07-04 10:03:29',1),
(207,621,'ddf60ed6e1b17d0055465567c3a66c627a62ce8cd460d3da1d23bebd18ca4928','YelHMXrVUcd9vds4pUR5ag2vvbSpKRpxYApnbO31Q4g=','2020-07-04 10:05:58','2020-07-04 10:05:58',1),
(208,622,'ddf60ed6e1b17d0055465567c3a66c627a62ce8cd460d3da1d23bebd18ca4928','YelHMXrVUcd9vds4pUR5ag2vvbSpKRpxYApnbO31Q4g=','2020-07-04 10:09:08','2020-07-04 10:09:08',1);

/*Table structure for table `batches` */

DROP TABLE IF EXISTS `batches`;

CREATE TABLE `batches` (
  `batches_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `start_time` varchar(45) NOT NULL,
  `end_time` varchar(45) NOT NULL,
  `has_limit` int(1) DEFAULT NULL,
  `batch_size` int(11) DEFAULT NULL,
  `frequency` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  `available_seats` int(11) DEFAULT NULL,
  `frequency_config` varchar(500) DEFAULT NULL,
  `subscription_id` int(11) DEFAULT NULL,
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`batches_id`),
  UNIQUE KEY `UUID` (`UUID`),
  KEY `event_id` (`event_id`),
  KEY `frequency` (`frequency`),
  KEY `subscription_id` (`subscription_id`),
  CONSTRAINT `batches_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`),
  CONSTRAINT `batches_ibfk_2` FOREIGN KEY (`frequency`) REFERENCES `event_batch_frequency` (`frequency_id`),
  CONSTRAINT `batches_ibfk_3` FOREIGN KEY (`subscription_id`) REFERENCES `subscription` (`subscription_id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8;

/*Data for the table `batches` */

insert  into `batches`(`batches_id`,`event_id`,`start_time`,`end_time`,`has_limit`,`batch_size`,`frequency`,`created_at`,`updated_at`,`isActive`,`available_seats`,`frequency_config`,`subscription_id`,`UUID`) values 
(1,3,'17:51','18:53',1,6,1,'2020-05-26 11:30:56','2020-05-26 11:30:56',1,4,'[\\\"Monday\\\", \\\"Wednesday\\\"]',57,'908975ddfafb718d9424085aa33a98111b25c1096e2bc5819d376b4f9adf2a18'),
(7,3,'04:05','06:53',1,15,1,'2020-05-29 08:12:51','2020-05-29 08:12:51',0,5,'[\\\"Monday\\\",\\\"Tuesday\\\",\\\"Wednesday\\\",\\\"Thursday\\\",\\\"Friday\\\",\\\"Saturday\\\",\\\"Sunday\\\"]',58,'720e25ddfafb718d9424085aa33a98111b25c1096e2bc5819d376b4f9adf2a18'),
(11,38,'05:05','06:53',1,6,3,'2020-06-01 10:28:05','2020-06-01 10:28:05',1,2,'[\\\"Tuesday\\\", \\\"Wednesday\\\", \\\"Friday\\\"]',67,'722e25ddfafb718d9424085aa33a98111b25c1096e2bc5819d376b4f9adf2a18'),
(13,3,'13:19','14:19',1,4,1,'2020-06-02 07:10:53','2020-06-02 07:10:53',1,5,'\"[\\\"Monday\\\",\\\"Tuesday\\\",\\\"Wednesday\\\",\\\"Thursday\\\",\\\"Friday\\\",\\\"Saturday\\\",\\\"Sunday\\\"]\"',60,'as345dddfafb718d9424085aa33a98111b25c1096e2bc5819d376b4f9adf2a18'),
(22,3,'05:05','06:53',6,6,1,'2020-06-05 10:20:09','2020-06-05 10:20:09',1,4,'[\\\"Monday\\\", \\\"Wednesday\\\"]',57,'90oyhuddfafb718d9424085aa33a98111b25c1096e2bc5819d376b4f9adf2a18'),
(23,3,'17:51','18:51',0,0,1,'2020-06-05 12:22:05','2020-06-05 12:22:05',1,3,'[\\\"Tuesday\\\",\\\"Thursday\\\",\\\"Saturday\\\"]',57,'7aifmdddfafb718d9424085aa33a98111b25c1096e2bc5819d376b4f9adf2a18'),
(24,3,'17:53','18:53',1,10,1,'2020-06-05 12:24:02','2020-06-05 12:24:02',1,4,'[\\\"Wednesday\\\",\\\"Friday\\\"]',57,'fesjdm004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(25,3,'19:26','20:26',0,0,3,'2020-06-05 13:57:15','2020-06-05 13:57:15',1,4,'\"[\\\"Monday\\\",\\\"Tuesday\\\",\\\"Wednesday\\\",\\\"Thursday\\\",\\\"Friday\\\",\\\"Saturday\\\",\\\"Sunday\\\"]\"',57,'mop2d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(26,3,'19:52','20:52',1,10,1,'2020-06-05 14:22:52','2020-06-05 14:22:52',1,4,'[\\\"Monday\\\",\\\"Tuesday\\\"]',57,'90ohs4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(27,3,'20:58','21:58',1,9,3,'2020-06-05 15:29:32','2020-06-05 15:29:32',1,4,'\"[\\\"Monday\\\",\\\"Tuesday\\\",\\\"Wednesday\\\",\\\"Thursday\\\",\\\"Friday\\\",\\\"Saturday\\\",\\\"Sunday\\\"]\"',57,'fe92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(29,41,'06:00','07:00',1,18,3,'2020-06-06 09:23:32','2020-06-06 09:23:32',1,4,'[\\\"Monday\\\",\\\"Tuesday\\\",\\\"Wednesday\\\",\\\"Thursday\\\",\\\"Friday\\\"]',76,'bahy64004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(30,41,'08:00','09:00',1,30,3,'2020-06-06 09:24:01','2020-06-06 09:24:01',1,4,'[\\\"Saturday\\\",\\\"Sunday\\\"]',76,'vdnei4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(31,41,'19:00','20:00',0,0,1,'2020-06-06 09:24:24','2020-06-06 09:24:24',1,4,'[\\\"Tuesday\\\",\\\"Wednesday\\\"]',76,'123456004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(36,41,'10:57','11:57',1,15,1,'2020-06-12 05:28:13','2020-06-12 05:28:13',1,4,'[\\\"Saturday\\\",\\\"Sunday\\\"]',76,'fe92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe53uio90'),
(37,41,'11:35','00:35',0,0,1,'2020-06-12 06:05:18','2020-06-12 06:05:18',0,4,'[\\\"Monday\\\",\\\"Tuesday\\\",\\\"Wednesday\\\",\\\"Thursday\\\",\\\"Friday\\\"]',76,'fe92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c90o'),
(38,47,'undefined','undefined',1,10,3,'2020-06-13 11:00:34','2020-06-13 11:00:34',1,5,'[\\\"Monday\\\",\\\"Tuesday\\\",\\\"Wednesday\\\",\\\"Thursday\\\",\\\"Friday\\\"]',84,'fe92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe53kkkkk'),
(39,38,'10:00','11:00',1,6,3,'2020-06-15 08:21:57','2020-06-15 08:21:57',1,4,'[\\\"Monday\\\",\\\"Tuesday\\\",\\\"Wednesday\\\",\\\"Thursday\\\",\\\"Friday\\\"]',70,'fe92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c89u'),
(41,3,'6:30','7:30',6,6,1,'2020-06-16 08:14:31','2020-06-16 08:14:31',0,4,NULL,74,'83e8deae-b80f-4882-a600-9d0029f6a0a4'),
(42,3,'6:30:00 AM','7:30:00 AM',6,6,1,'2020-06-16 08:14:47','2020-06-16 08:14:47',1,4,NULL,NULL,'f03b5f15-5301-4806-a72a-9f84a959383f'),
(43,3,'6:30:00 AM','7:30:00 AM',6,6,1,'2020-06-16 08:14:48','2020-06-16 08:14:48',1,4,NULL,NULL,'db524fbf-6b69-43c4-96f8-2c212210e33a'),
(44,3,'6:30:00 AM','7:30:00 AM',6,6,1,'2020-06-16 08:14:50','2020-06-16 08:14:50',1,4,NULL,NULL,'d915cd4c-5183-48a6-b885-49cc5601ef68'),
(45,3,'6:30:00 AM','7:30:00 AM',6,6,1,'2020-06-16 08:14:52','2020-06-16 08:14:52',1,4,NULL,NULL,'7f3d1375-ec43-472a-99f6-3400adba7f42'),
(56,3,'6:30','7:30',6,6,1,'2020-06-22 13:56:40','2020-06-22 13:56:40',1,4,NULL,96,'f9a118c307a023270f980478cdf7d30de09b4bbd39e7fcba907d366c1deb91b7'),
(57,3,'6:30','7:30',6,6,1,'2020-06-22 13:58:06','2020-06-22 13:58:06',1,4,NULL,96,'54fb22446fb707142b8b7305c28cd557038cc32befae9f7d66273038b0fe6ee7'),
(58,3,'21:10','22:10',0,0,1,'2020-06-22 15:35:53','2020-06-22 15:35:53',1,3,'[\\\"Monday\\\",\\\"Tuesday\\\",\\\"Wednesday\\\",\\\"Thursday\\\",\\\"Friday\\\",\\\"Saturday\\\",\\\"Sunday\\\"]',58,'1b45bd75-b5a1-42db-9f6c-26f0b7ed0edb'),
(59,38,'17:50','18:50',1,20,1,'2020-06-26 06:04:44','2020-06-26 06:04:44',1,4,'',100,'ee895607a83c5daf876b73a5ad2f3bda0b91169866ca6ad27df3b52ca2e19767'),
(60,38,'05:35','06:35',1,20,3,'2020-06-26 06:05:45','2020-06-26 06:05:45',1,4,'[\\\"Monday\\\",\\\"Wednesday\\\",\\\"Saturday\\\"]',100,'bd11ce69203ada717525fc2c3a379ae4b730d8a5c11cc1977989973c8703880d'),
(61,38,'11:55','00:55',1,30,1,'2020-06-26 06:25:53','2020-06-26 06:25:53',1,4,'',101,'a4931dff3f82d64912d169cc8a40f508f8800833de59851582e53c1027dc0f16'),
(62,38,'12:35','13:35',1,10,1,'2020-06-26 07:05:49','2020-06-26 07:05:49',1,4,'[\\\"Monday\\\",\\\"Tuesday\\\",\\\"Wednesday\\\",\\\"Thursday\\\",\\\"Friday\\\",\\\"Saturday\\\",\\\"Sunday\\\"]',102,'82e305807e0d8e1caee2f0370d67ef6e2baf355d27b004d4949654497a5b47af'),
(63,38,'11:55','00:55',1,11,1,'2020-06-26 07:38:57','2020-06-26 07:38:57',1,4,'[\\\"Monday\\\",\\\"Tuesday\\\",\\\"Wednesday\\\",\\\"Thursday\\\",\\\"Friday\\\",\\\"Saturday\\\",\\\"Sunday\\\"]',102,'ee895607a83c5daf876sdfg5ad2f3bda0b91169866ca6ad27df3b52ca2e19767'),
(65,38,'13:14','14:14',1,25,3,'2020-06-26 07:44:38','2020-06-26 07:44:38',1,4,'[\\\"Monday\\\",\"\\Tuesday\\\",\"\\Wednesday\\\",\"\\Thursday\\\"]',102,'23d53dff511082edc526b934d0213a874ff1b9c249929cae916d50f297913fb9'),
(68,38,'05:00','06:00',1,11,3,'2020-06-26 07:45:08','2020-06-26 07:45:08',1,4,'\"[\\\"Monday\\\",\\\"Wednesday\\\",\\\"Friday\\\"]\"',102,'bd11ce6920sdea717525fc2c3a379ae4b730d8a5c11cc1977989973c8703880d'),
(69,3,'18:56','19:56',1,10,3,'2020-06-27 13:26:45','2020-06-27 13:26:45',1,5,'\"[\\\"Monday\\\",\\\"Wednesday\\\",\\\"Friday\\\"]\"',60,'3c64255e36db4b1c2feabd39f34469839c847a8d6981e1fce91021f90bcdb860'),
(70,3,'18:59','19:59',1,13,3,'2020-06-27 13:29:34','2020-06-27 13:29:34',1,4,'\"[\\\"Monday\\\",\\\"Tuesday\\\",\\\"Wednesday\\\",\\\"Thursday\\\",\\\"Friday\\\"]\"',60,'a89fb4208a43f380acf3f9131ce52383d06932f493740a229da99ff4c7f0a38d'),
(71,3,'20:46','21:46',1,10,3,'2020-06-27 15:17:04','2020-06-27 15:17:04',1,2,'\"[\\\"Monday\\\",\\\"Wednesday\\\",\\\"Friday\\\"]\"',60,'dae517fc2ff7a199d298fdfe449bd8cd2a6c3d5e42699e1c9876230ace07dbaf'),
(72,41,'11:00','12:00',1,12,3,'2020-06-28 06:41:55','2020-06-28 06:41:55',1,4,'[\"Monday\"]',76,'714896e337b665aae6803c72e1651b874219ddb61e9d07b2d53e14b81c7c9b06'),
(73,3,'13:30','14:30',1,14,1,'2020-07-04 07:51:38','2020-07-04 07:51:38',0,10,'\"[\\\"Monday\\\",\\\"Wednesday\\\",\\\"Friday\\\"]\"',59,'63127aab7fd7701b13b39385d83530b4a1e6ef00bf41f2ab5f8acea70f4c9735'),
(74,3,'13:37','13:37',0,0,3,'2020-07-04 08:07:52','2020-07-04 08:07:52',1,0,'\"[\\\"Monday\\\",\\\"Wednesday\\\",\\\"Saturday\\\"]\"',59,'781bf1955c7c4e89f5812a39e636a5d0a804d6fd28d2d4afb625f41c12316bba'),
(75,3,'14:44','15:44',0,0,1,'2020-07-04 08:14:57','2020-07-04 08:14:57',1,0,'\"[\\\"Wednesday\\\",\\\"Friday\\\"]\"',59,'45cfba4b0561a5da398a8ed5f914d83fff969c4469167b02c0c206b01a06a69f'),
(76,3,'13:57','14:57',0,0,3,'2020-07-04 08:27:39','2020-07-04 08:27:39',0,0,'\"[\\\"Wednesday\\\",\\\"Friday\\\"]\"',59,'c3e67bfa84cbc73a791eb7ff5bf17216aa234ad0953569c68c31de9a72678cd3'),
(77,3,'14:00','15:01',0,0,3,'2020-07-04 08:32:00','2020-07-04 08:32:00',1,0,'\"[\\\"Monday\\\",\\\"Wednesday\\\",\\\"Friday\\\"]\"',59,'d0554bd12ad127a9fd01fd324d1b2f85ed329028c302101caf97da3fd35357bb');

/*Table structure for table `calendar` */

DROP TABLE IF EXISTS `calendar`;

CREATE TABLE `calendar` (
  `calendar_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  PRIMARY KEY (`calendar_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `calendar_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `calendar` */

/*Table structure for table `contactus` */

DROP TABLE IF EXISTS `contactus`;

CREATE TABLE `contactus` (
  `contact_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile_number` varchar(30) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `message` varchar(500) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  PRIMARY KEY (`contact_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `contactus` */

insert  into `contactus`(`contact_id`,`full_name`,`email`,`mobile_number`,`subject`,`message`,`created_at`,`updated_at`,`isActive`) values 
(3,'vishwa','vishwa@gmail.com','9898989898','product','price','2020-04-23 16:19:27','2020-04-23 16:19:27',1),
(6,'asdasd','sriharsha.cr@maiora.co','9876543212','Test','Testing','2020-04-26 06:21:29','2020-04-26 06:21:29',1),
(7,'harsha','sriharsha.cr@maiora.co','9876543212','contact','this is a test message','2020-04-29 16:46:12','2020-04-29 16:46:12',1);

/*Table structure for table `coupon` */

DROP TABLE IF EXISTS `coupon`;

CREATE TABLE `coupon` (
  `coupon_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `description` text,
  `image_url` varchar(200) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `discount_percent` int(11) NOT NULL DEFAULT '0' COMMENT 'Discount in terms of Percentage',
  `max_discount_amount` int(11) NOT NULL DEFAULT '0' COMMENT 'Max amount that can be deducted as discount',
  `expiry` datetime DEFAULT CURRENT_TIMESTAMP,
  `usage_count` int(11) DEFAULT '0',
  `max_usage_count` int(11) DEFAULT '0' COMMENT 'Max number of times, this coupone can be used',
  `isActive` int(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`coupon_id`),
  UNIQUE KEY `UUID` (`UUID`),
  KEY `FK` (`event_id`),
  CONSTRAINT `FK` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

/*Data for the table `coupon` */

insert  into `coupon`(`coupon_id`,`title`,`description`,`image_url`,`event_id`,`discount_percent`,`max_discount_amount`,`expiry`,`usage_count`,`max_usage_count`,`isActive`,`created_at`,`updated_at`,`UUID`) values 
(3,'FIT50','50% discount',NULL,3,50,100,'2020-06-01 00:00:00',1,10,0,'2020-04-30 13:23:40','2020-04-30 13:23:40','fe92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(4,'MAY40','40% discount',NULL,3,40,100,'2020-06-01 00:00:00',1,10,0,'2020-04-30 13:23:40','2020-04-30 13:23:40','2d8af3b0b0jui8931793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(11,'JUN40','40% discount',NULL,3,40,100,'2020-07-01 00:00:00',1,10,1,'2020-06-01 07:15:55','2020-06-01 07:15:55','io90o3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(12,'COUPON1','10% discount',NULL,41,10,100,'2020-07-01 00:00:00',1,10,1,'2020-06-06 14:05:15','2020-06-06 14:05:15','ki8903b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(16,'RunAway',NULL,NULL,47,30,1200,'2020-07-01 00:00:00',0,15,1,'2020-06-13 11:31:28','2020-06-13 11:31:28','mkoof3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(18,'WWWWWWWWWWWW',NULL,NULL,3,2,100,'2020-05-28 18:30:00',0,10,0,'2020-06-16 10:15:55','2020-06-16 10:15:55','07ac5796-bd88-4903-ba7c-af84a2be5b19'),
(19,'JUN500',NULL,NULL,3,2,100,'2020-05-28 18:30:00',0,10,1,'2020-06-16 10:16:03','2020-06-16 10:16:03','0463b768-6621-436f-a9f0-55e17a531a84'),
(20,'JUN100',NULL,NULL,3,2,100,'2020-05-28 18:30:00',0,10,1,'2020-06-16 10:16:04','2020-06-16 10:16:04','f92e0eae-4ac3-4616-8fdb-bfd42c5a59ef'),
(21,'asdasdr234',NULL,NULL,3,2,100,'2020-05-28 18:30:00',0,10,0,'2020-06-16 10:16:05','2020-06-16 10:16:05','8140988a-dbf0-415e-af3b-14222dad7b75'),
(22,'JUN85',NULL,NULL,3,11,200,'2020-12-01 00:00:00',0,11,1,'2020-06-22 13:28:14','2020-06-22 13:28:14','ebf37849-8df5-42ec-98e2-7ca8ed3d71fc'),
(23,'JULY25',NULL,NULL,3,2,100,'2020-05-28 18:30:00',0,8,0,'2020-06-22 14:09:10','2020-06-22 14:09:10','2d8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(24,'july28',NULL,NULL,3,5,300,'2020-11-27 00:00:00',0,9,0,'2020-07-04 07:22:46','2020-07-04 07:22:46','03bd05699b0c709414a5a59d6d1cd8fae955d00f8194df0037157e7cb60f1472');

/*Table structure for table `event` */

DROP TABLE IF EXISTS `event`;

CREATE TABLE `event` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `gallery_id` int(11) DEFAULT NULL,
  `event_master_id` int(11) NOT NULL,
  `event_name` varchar(200) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `cover_image` varchar(500) DEFAULT NULL,
  `start_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `end_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_repetitive` int(1) DEFAULT '0',
  `repeat_every` varchar(45) DEFAULT NULL COMMENT 'Repete every "day", "Week", "Month"',
  `start_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `end_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `price` double DEFAULT '0',
  `trial_period` int(2) NOT NULL DEFAULT '0' COMMENT 'Trial Period, in Days',
  `meeting_links` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) NOT NULL DEFAULT '1',
  `instructor_id` int(11) DEFAULT NULL,
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  UNIQUE KEY `UUID` (`UUID`),
  KEY `gallery_id` (`gallery_id`),
  KEY `event_master_id` (`event_master_id`),
  KEY `instructor_id` (`instructor_id`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`gallery_id`) REFERENCES `gallery` (`gallery_id`),
  CONSTRAINT `event_ibfk_2` FOREIGN KEY (`event_master_id`) REFERENCES `event_master` (`event_master_id`),
  CONSTRAINT `event_ibfk_3` FOREIGN KEY (`instructor_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

/*Data for the table `event` */

insert  into `event`(`event_id`,`gallery_id`,`event_master_id`,`event_name`,`description`,`cover_image`,`start_date`,`end_date`,`is_repetitive`,`repeat_every`,`start_time`,`end_time`,`price`,`trial_period`,`meeting_links`,`created_at`,`updated_at`,`isActive`,`instructor_id`,`UUID`) values 
(3,NULL,3,'Exercise with friends & Family Members.','Having<font face=\"Arial\">&#160;someone</font> to motivate you can make all the difference to achieving your goal. We know that exercise is great for our minds and bodies, but sometimes its challenging to maintain interest. Thats why exercising with a friend can be a huge benefit. Here are a few reasons to get exercising with a friend. Youre less likely to get bored when you have a workout buddy, especially a friend. While youre catching up, having a laugh and encouraging each other, youre also getting healthier. Its a win-win situation.','https://cdn.pixabay.com/photo/2017/08/06/12/52/people-2592247__480.jpg','2020-05-05 18:30:00','2021-05-05 18:30:00',0,NULL,'2020-06-01 08:52:54','2020-06-25 08:52:48',800,2,'https://zoom.us/j/99160280680?pwd=S3dLMkxNL29WcHlsRnNua3Myb0FRQT09','2020-04-23 16:23:30','2020-04-23 16:23:30',1,103,'999af3bsksia4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(38,NULL,10,'Yoga with Chethan','It’s time to roll out your yoga mat and discover the combination of physical and mental exercises that for thousands of years have hooked yoga practitioners around the globe. The beauty of yoga is that you don’t have to be a yogi or yogini to reap the benefits. Whether you are young or old, overweight or fit, yoga has the power to calm the mind and strengthen the body. Don’t be intimidated by yoga terminology, fancy yoga studios and complicated poses. Yoga is for everyone.','https://cdn.pixabay.com/photo/2017/04/27/08/29/sport-2264825__480.jpg','2020-05-25 15:09:01','2020-05-25 15:09:01',0,NULL,'2020-05-25 15:09:02','2020-06-25 13:25:15',300,0,'https://us02web.zoom.us/j/89298164607?pwd=Qzh4NVp1QnJCOFQ2ODBRMkg2MXNsdz09','2020-05-25 15:09:01','2020-05-25 15:09:01',1,103,'asewf3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(41,NULL,3,'Zumba for all','Zumba was founded in 1998 by Prez in Cali, Colombia. Prez, an aerobics instructor, forgot to bring his regular music to his aerobics class. He happened to have cassette tapes of Latin dance musicsalsa and merengueand danced to them instead, which Prez later taught as Rumbacize. In 2001, Prez partnered with Alberto Perlman and Alberto Aghion, and the trio released a series of fitness videos sold via infomercial. Insight Venture Partners and the Raine Group made an investment in 2012. The company expanded into class instruction and by 2015, according to Perlman, there were 14 million Zumba students in 186 countries.','https://cdn.pixabay.com/photo/2017/08/02/20/24/people-2573216__480.jpg','2020-06-06 09:21:14','2020-06-06 09:21:14',0,NULL,'2020-06-06 09:21:14','2020-06-25 09:21:14',200,0,'https://us02web.zoom.us/j/89298164607?pwd=Qzh4NVp1QnJCOFQ2ODBRMkg2MXNsdz09','2020-06-06 09:21:14','2020-06-06 09:21:14',0,281,'2d8af3b0b08a4be31793c9524e1856bjui9043b41c94d029496e87f36bc7dc40'),
(47,NULL,4,'FreePark','Welcome to the world of Freerunning  Parkour.For personal use, Freepark Smart Parking Lock enables you to authorize anyone you want to park in your reserved parking spot by using a smartphone or a web panel. ','http://fit-social-backend.herokuapp.com/uploads/events/47/ceac8427fe5a27eba934edab4df43602.jpg','2020-06-19 18:30:00','2020-08-30 18:30:00',0,NULL,'2020-06-13 03:35:32','2020-06-13 03:35:32',5000,7,NULL,'2020-06-13 03:35:31','2020-06-13 03:35:31',0,492,'2d8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(49,NULL,10,'Kids Yoga Sessions','Yoga session designed for kids, below the age of 16 years','https://cdn.pixabay.com/photo/2017/12/27/20/47/little-girl-3043751_1280.jpg','2020-06-16 11:09:57','2020-06-29 11:09:57',0,NULL,'2020-06-16 11:09:56','2020-06-24 11:09:56',200,5,NULL,'2020-06-16 11:09:57','2020-06-16 11:09:57',0,45,'24c8365e-8185-403e-ab34-e10383c1a9ad'),
(60,NULL,10,'urbanladder','Having<font face=\"Arial\">&#160;someone</font>&#160;to motivate you can make all the difference to achieving your goal. We know that exercise is great for our minds and bodies, but sometimes its challenging to maintain interest. Thats why exercising with a friend can be a huge benefit. Here are a few reasons to get exercising with a friend. Youre less likely to get bored when you have a workout buddy, especially a friend. While youre catching up, having a laugh and encouraging each other, youre also getting healthier. Its a win-win situation.<br>','https://cdn.pixabay.com/photo/2015/07/30/17/24/audience-868074__480.jpg','2020-06-25 18:30:00','2020-06-29 18:30:00',0,NULL,'2020-06-26 11:28:23','2020-06-26 11:28:23',0,0,'www.cricbuzz.com','2020-06-26 11:28:22','2020-06-26 11:28:22',0,103,'d4c0ecef68b059e951348a36279edb9fea22f54f6f2e2af0e286cd02dd3e47eb'),
(61,NULL,10,'sssssss','Having<font face=\"Arial\">&#160;someone</font>&#160;to motivate you can make all the difference to achieving your goal. We know that exercise is great for our minds and bodies, but sometimes its challenging to maintain interest. Thats why exercising with a friend can be a huge benefit. Here are a few reasons to get exercising with a friend. Youre less likely to get bored when you have a workout buddy, especially a friend. While youre catching up, having a laugh and encouraging each other, youre also getting healthier. Its a win-win situation.','https://cdn.pixabay.com/photo/2015/07/30/17/24/audience-868074__480.jpg','2020-06-24 18:30:00','2020-06-28 18:30:00',0,NULL,'2020-06-26 11:28:23','2020-06-26 11:28:23',21221,1,'www.ddddd.com','2020-06-26 12:06:11','2020-06-26 12:06:11',0,103,'a2a6fd76a95fd1678fa0076822f308f02716e1642b21ab8ab71c27dce2016671'),
(62,NULL,10,'weerrr','Having<font face=\"Arial\">&#160;someone</font>&#160;to motivate you can make all the difference to achieving your goal. We know that exercise is great for our minds and bodies, but sometimes its challenging to maintain interest. Thats why exercising with a friend can be a huge benefit. Here are a few reasons to get exercising with a friend. Youre less likely to get bored when you have a workout buddy, especially a friend. While youre catching up, having a laugh and encouraging each other, youre also getting healthier. Its a win-win situation.','https://cdn.pixabay.com/photo/2015/07/30/17/24/audience-868074__480.jpg','2020-06-24 18:30:00','2020-06-28 18:30:00',0,NULL,'2020-06-26 11:28:23','2020-06-26 11:28:23',21221,1,'www.ddddd.com','2020-06-26 12:07:29','2020-06-26 12:07:29',0,103,'8bbf81df3723af9c0a059804401e8526bb13b8810e6ce10198c0c3714b2b3ad0'),
(63,NULL,4,'urbanladder','<span>You already know there are many great reasons to exercise&#8212;from improving energy, mood, sleep, and health to reducing anxiety, stress, and depression. And detailed exercise instructions and workout plans are just a click away. But if knowing how and why to exercise was enough, we&#8217;d all be in shape. Making exercise a habit takes more&#8212;you need the right mindset and a smart approach.</span>','https://cdn.pixabay.com/photo/2016/03/27/23/08/gymnastics-1284656__480.jpg','2020-06-29 18:30:00','2020-07-29 18:30:00',0,NULL,'2020-06-29 06:26:45','2020-06-29 06:26:45',600,2,NULL,'2020-06-29 06:26:44','2020-06-29 06:26:44',0,103,'a63d3ddde0a668b3786ee639449843d878faf59501bc670a35d80ea2d4237bfd');

/*Table structure for table `event_batch_frequency` */

DROP TABLE IF EXISTS `event_batch_frequency`;

CREATE TABLE `event_batch_frequency` (
  `frequency_id` int(11) NOT NULL AUTO_INCREMENT,
  `frequency` varchar(100) NOT NULL,
  `order` varchar(999) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`frequency_id`),
  UNIQUE KEY `UUID` (`UUID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `event_batch_frequency` */

insert  into `event_batch_frequency`(`frequency_id`,`frequency`,`order`,`created_at`,`updated_at`,`isActive`,`UUID`) values 
(1,'DAILY','DAILY','2020-05-26 07:19:59','2020-05-26 07:19:59',1,'2d8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(3,'WEEKLY','[MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY]','2020-05-26 07:21:01','2020-05-26 07:21:01',1,'2d8aamkio08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40');

/*Table structure for table `event_master` */

DROP TABLE IF EXISTS `event_master`;

CREATE TABLE `event_master` (
  `event_master_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_master_name` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `image` varchar(500) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`event_master_id`),
  UNIQUE KEY `UNIQUE` (`event_master_name`) COMMENT 'Event master names must be unique',
  UNIQUE KEY `UUID` (`UUID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

/*Data for the table `event_master` */

insert  into `event_master`(`event_master_id`,`event_master_name`,`description`,`image`,`created_at`,`updated_at`,`isActive`,`UUID`) values 
(3,'Zumba','A joyful workout session, dancing and music all at once.','https://cdn.pixabay.com/photo/2019/06/30/20/09/zumba-4308708_1280.jpg','2020-04-19 09:52:01','2020-04-19 09:52:01',1,'2d8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(4,'Stretching Exercise','Stretching helps in loosen muscles and tendons to increase the range of motion of various joints, and literally warm up the body.','https://cdn.pixabay.com/photo/2018/01/01/01/56/yoga-3053488_1280.jpg','2020-04-19 11:20:12','2020-04-19 11:20:12',1,'2d8af3b0b08a4mjki93c9524e1856b43d8d43b41c94d029496e87f36bc7dc401'),
(10,'Yoga For Beginner','Start your day, with simple yogic postures that are custom designed to suit everyone.  ','https://cdn.pixabay.com/photo/2018/05/22/01/27/pilates-3420253_1280.jpg','2020-04-19 12:32:11','2020-04-19 12:32:11',1,'a12343b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40');

/*Table structure for table `fitness_center` */

DROP TABLE IF EXISTS `fitness_center`;

CREATE TABLE `fitness_center` (
  `center_id` int(11) NOT NULL AUTO_INCREMENT,
  `place_id` int(11) NOT NULL,
  `center_name` varchar(200) NOT NULL,
  `phone_number` varchar(100) NOT NULL,
  `email_id` varchar(100) NOT NULL,
  `social_links` varchar(900) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  PRIMARY KEY (`center_id`),
  KEY `place_id` (`place_id`),
  CONSTRAINT `fitness_center_ibfk_1` FOREIGN KEY (`place_id`) REFERENCES `address` (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `fitness_center` */

insert  into `fitness_center`(`center_id`,`place_id`,`center_name`,`phone_number`,`email_id`,`social_links`,`created_at`,`updated_at`,`isActive`) values 
(2,15,'CULT Fit','9876543210','cult@gmail.com','[instagram.com, facebook.com]','2020-04-20 07:58:33','2020-04-20 07:58:33',1),
(3,11,'asdasd','34234234','asda@asdasd.asdasd','[\"\"]','2020-04-27 18:24:41','2020-04-27 18:24:41',1),
(4,15,'CULT Fit','9876543210','cult@gmail.com','[instagram.com, facebook.com]','2020-04-27 18:26:12','2020-04-27 18:26:12',1);

/*Table structure for table `fitness_info` */

DROP TABLE IF EXISTS `fitness_info`;

CREATE TABLE `fitness_info` (
  `fitness_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `height` varchar(100) NOT NULL,
  `weight` varchar(100) NOT NULL,
  `BMI` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`fitness_info_id`),
  UNIQUE KEY `UUID` (`UUID`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fitness_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

/*Data for the table `fitness_info` */

insert  into `fitness_info`(`fitness_info_id`,`user_id`,`height`,`weight`,`BMI`,`created_at`,`updated_at`,`isActive`,`UUID`) values 
(2,45,'5\'6','57','20.3','2020-04-27 17:15:36','2020-04-27 17:15:36',1,'9c353wheud283db33fc59d981db34ce083249acf6f83b84d8e5062cb9c5e4f84'),
(3,45,'5\'6','65','23','2020-04-27 18:17:16','2020-04-27 18:17:16',1,'io90p1b786283db33fc59d981db34ce083249acf6f83b84d8e5062cb9c5e4f84'),
(7,81,'1.8','70','19','2020-05-16 09:03:53','2020-05-16 09:03:53',1,'qwe341b786283db33fc59d981db34ce083249acf6f83b84d8e5062cb9c5e4f84'),
(8,103,'6.5','80','20','2020-05-18 12:38:32','2020-05-18 12:38:32',1,'2d8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(9,25,'5.7','96','31','2020-05-25 06:54:01','2020-05-25 06:54:01',1,'io90o1b786283db33fc59d981db34ce083249acf6f83b84d8e5062cb9c5e4f84'),
(11,25,'111','55','55','2020-06-16 12:41:44','2020-06-16 12:41:44',0,'3aeccfaa-c1b2-45bd-9685-943b7f846d6e'),
(13,25,'11\'1','55','55','2020-06-22 15:28:36','2020-06-22 15:28:36',1,'9c3531b786283db33fc59d981db34ce083249acf6f83b84d8e5062cb9c5e4f84');

/*Table structure for table `gallery` */

DROP TABLE IF EXISTS `gallery`;

CREATE TABLE `gallery` (
  `gallery_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  PRIMARY KEY (`gallery_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `gallery_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `gallery` */

/*Table structure for table `gallery_items` */

DROP TABLE IF EXISTS `gallery_items`;

CREATE TABLE `gallery_items` (
  `gallery_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `gallery_id` int(11) NOT NULL,
  `media_type_id` int(11) NOT NULL,
  `media_path` varchar(200) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  PRIMARY KEY (`gallery_item_id`),
  KEY `gallery_id` (`gallery_id`),
  KEY `media_type_id` (`media_type_id`),
  CONSTRAINT `gallery_items_ibfk_1` FOREIGN KEY (`gallery_id`) REFERENCES `gallery` (`gallery_id`),
  CONSTRAINT `gallery_items_ibfk_2` FOREIGN KEY (`media_type_id`) REFERENCES `media_type_master` (`media_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `gallery_items` */

/*Table structure for table `media_type_master` */

DROP TABLE IF EXISTS `media_type_master`;

CREATE TABLE `media_type_master` (
  `media_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `media_type_name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`media_type_id`),
  UNIQUE KEY `UUID` (`UUID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `media_type_master` */

insert  into `media_type_master`(`media_type_id`,`media_type_name`,`created_at`,`updated_at`,`isActive`,`UUID`) values 
(1,'IMAGE','2020-04-19 14:00:18','2020-04-19 14:00:18',1,'9c3531b786283db33fc59d981db34ce083249acf6f83b84d8e5062cb9c5e4f84'),
(2,'VIDEO','2020-04-19 16:34:34','2020-04-19 16:34:34',1,'9c3531b786283db33fc59d981db34ce083249acf6f83b84d8e5062cb9i894f84');

/*Table structure for table `payment` */

DROP TABLE IF EXISTS `payment`;

CREATE TABLE `payment` (
  `slno` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `subscription_id` int(11) DEFAULT NULL,
  `order_id` varchar(100) DEFAULT NULL COMMENT 'Obtained by RazorPay',
  `payment_id` varchar(100) DEFAULT NULL COMMENT 'Obtained by RazorPay',
  `payment_status` varchar(100) NOT NULL DEFAULT 'PENDING' COMMENT 'Obtained by RazorPay',
  `signature` text COMMENT 'Obtained by RazorPay',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`slno`),
  UNIQUE KEY `UUID` (`UUID`),
  KEY `user_id` (`user_id`),
  KEY `payment_ibfk_2` (`subscription_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`subscription_id`) REFERENCES `subscription` (`subscription_id`)
) ENGINE=InnoDB AUTO_INCREMENT=308 DEFAULT CHARSET=utf8;

/*Data for the table `payment` */

insert  into `payment`(`slno`,`user_id`,`subscription_id`,`order_id`,`payment_id`,`payment_status`,`signature`,`created_at`,`updated_at`,`isActive`,`UUID`) values 
(263,80,76,'order_F3GM3NfuRih4DZ','pay_F3GMF26LbqXjpz','PAID','{\"razorpay_payment_id\":\"pay_F3GMF26LbqXjpz\",\"razorpay_order_id\":\"order_F3GM3NfuRih4DZ\",\"razorpay_signature\":\"140fef727e979de45ca2bc2d924ec2331cba2991840e2b547a9765f2723288d0\"}','2020-06-16 10:28:51','2020-06-16 10:28:51',1,'fpwmd4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(264,80,58,'order_F3H1BCyhVn32Qa','pay_F3H1X9TDjdZj4i','PAID','{\"razorpay_payment_id\":\"pay_F3H1X9TDjdZj4i\",\"razorpay_order_id\":\"order_F3H1BCyhVn32Qa\",\"razorpay_signature\":\"a73cafb9a35fac262c4922b2c11900ee479fd2d993dedb30b31276fb2f1c3923\"}','2020-06-16 11:07:56','2020-06-16 11:07:56',1,'fe9201204b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(265,80,70,NULL,NULL,'PAID','{\"razorpay_order_id\":\"\",\"razorpay_payment_id\":\"\"}','2020-06-16 11:08:55','2020-06-16 11:08:55',1,'311534b1a2cw28f0f8fb5af3d7398a4e02206ce0e1d15c2e032b26c8462cc5db'),
(282,77,57,'order_EhU93DAKzvm9zU','pay_Eh9W48cI8myLjn','Pending','{THis is the response JSON after RazorPay payment}','2020-06-25 15:33:07','2020-06-25 15:33:07',1,'9eb947f4036a77869af88c4652a49a98000af20115bc1443266de898656e5e57'),
(283,77,57,'order_EhU93DAKzvm9zU','pay_Eh9W48cI8myLjn','Pending','{THis is the response JSON after RazorPay payment}','2020-06-26 05:08:24','2020-06-26 05:08:24',1,'9020c2b7c58d26666fa3cbe00da3a17e4768ab52c06f700e28a57f713856be66'),
(294,568,NULL,NULL,NULL,'PENDING',NULL,'2020-06-27 14:03:58','2020-06-27 14:03:58',1,NULL),
(295,25,60,'order_F8MCO6YRpgbHUs','pay_F8MCSorZkhOWW3','PAID','{\"razorpay_payment_id\":\"pay_F8MCSorZkhOWW3\",\"razorpay_order_id\":\"order_F8MCO6YRpgbHUs\",\"razorpay_signature\":\"bad86abb75eed5dc34e4ee422b3a2117c735bf9bdd2c648498e2d621809b9a03\"}','2020-06-29 07:26:48','2020-06-29 07:26:48',1,'f7df00b4b49a0e5ae118370735c4e14f5366583bd8286d2aaa8ec583d1ec491c'),
(296,25,60,'order_EhU93DAKzvm9zU','pay_Eh9W48cI8myLjn','Pending','{THis is the response JSON after RazorPay payment}','2020-06-29 07:48:51','2020-06-29 07:48:51',1,'d53d77733f7ed8ec53d168759a589955ea021e84d6ca34806b8ee92070897199'),
(297,25,60,'order_EhU93DAKzvm9zU','pay_Eh9W48cI8myLjn','Pending','{THis is the response JSON after RazorPay payment}','2020-06-29 07:50:39','2020-06-29 07:50:39',1,'c2114f5be7f056a38bcffff40908c2bc5eb6c307f9cb27165fbc176bd19b129d'),
(298,25,60,'order_EhU93DAKzvm9zU','pay_Eh9W48cI8myLjn','Pending','{THis is the response JSON after RazorPay payment}','2020-06-29 07:51:43','2020-06-29 07:51:43',1,'b23052bf85a9a1209d133365a3df3c5578f7360708e5af0299f9bbc2635cc2f3'),
(299,25,60,'order_F9yWDkBL6VeuHM','pay_F9yWHeXUcLsqe2','PAID','{\"razorpay_payment_id\":\"pay_F9yWHeXUcLsqe2\",\"razorpay_order_id\":\"order_F9yWDkBL6VeuHM\",\"razorpay_signature\":\"a79438b901d180d5959b471cae03d6d6040355e5435bc0dcc1e68adaf1a0bab6\"}','2020-07-03 09:34:54','2020-07-03 09:34:54',1,'af6010350de19b4a744475ec39c81452ff757d556d59774635be8ae32b134d10'),
(300,25,58,'order_F9zRwJu9QWQ8af','pay_F9zS1yrTh3RE8C','PAID','{\"razorpay_payment_id\":\"pay_F9zS1yrTh3RE8C\",\"razorpay_order_id\":\"order_F9zRwJu9QWQ8af\",\"razorpay_signature\":\"74feb9bd8f5c21b20452dc0fd43819e6e648ebb8b6146f0706f5b3d3a2c07ce0\"}','2020-07-03 10:29:35','2020-07-03 10:29:35',1,'e537833990099a687f1ae64a8452e20a857404510bb2c93bf10239ab6ff78bc0'),
(302,620,NULL,NULL,NULL,'PENDING',NULL,'2020-07-04 10:03:36','2020-07-04 10:03:36',1,NULL),
(303,621,NULL,NULL,NULL,'PENDING',NULL,'2020-07-04 10:06:05','2020-07-04 10:06:05',1,NULL),
(304,622,NULL,NULL,NULL,'PENDING',NULL,'2020-07-04 10:09:15','2020-07-04 10:09:15',1,NULL),
(305,25,59,'order_FANiRIfp4G8lGa','pay_FANiVLAxbzKZPv','PAID','{\"razorpay_payment_id\":\"pay_FANiVLAxbzKZPv\",\"razorpay_order_id\":\"order_FANiRIfp4G8lGa\",\"razorpay_signature\":\"5df3b3845557ebd158a2a911fe7ab01c49d1ca0b23f7fc5a62729896f9e19872\"}','2020-07-04 10:13:50','2020-07-04 10:13:50',1,'61be01bde13b0c2b989b8c337bd5c6897cb80249472f224bc45723717f9a3e05'),
(306,80,58,'order_FAO7Mutp9aAGws','pay_FAO84hGpVs9ydD','PAID','{\"razorpay_payment_id\":\"pay_FAO84hGpVs9ydD\",\"razorpay_order_id\":\"order_FAO7Mutp9aAGws\",\"razorpay_signature\":\"77120821c0336d49da0b00c0e71688047098a1f97c01a7bb94e12948d13526ce\"}','2020-07-04 10:38:02','2020-07-04 10:38:02',1,'82510f306784dfe7b50e9cf649fd27ac3a4fddae3262da037dee104f02ab74d2'),
(307,80,57,'order_FAOBwOfx5whovV','pay_FAOC1eIZWKbTVV','PAID','{\"razorpay_payment_id\":\"pay_FAOC1eIZWKbTVV\",\"razorpay_order_id\":\"order_FAOBwOfx5whovV\",\"razorpay_signature\":\"f0f078dad65daf4a7412e426d5c84e776a792875e335b7f202647b74d041c2fc\"}','2020-07-04 10:41:46','2020-07-04 10:41:46',1,'a62ec68951abfe0ae722aa4df858d3fc80cc6feac60a1382fd3b393adf97cd09');

/*Table structure for table `points_master` */

DROP TABLE IF EXISTS `points_master`;

CREATE TABLE `points_master` (
  `points_id` int(11) NOT NULL AUTO_INCREMENT,
  `action_name` varchar(100) NOT NULL,
  `points` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`points_id`),
  UNIQUE KEY `UUID` (`UUID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `points_master` */

insert  into `points_master`(`points_id`,`action_name`,`points`,`created_at`,`updated_at`,`isActive`,`UUID`) values 
(1,'REFERRAL_USER',200,'2020-06-24 10:13:00','2020-06-24 10:13:00',1,'d88b445620446f4f6997a58a8faed8981141c34f066f5a788d3ded58656ce2ae'),
(2,'REFERRAL_TRAINER',500,'2020-06-24 10:13:33','2020-06-24 10:13:33',1,'ccea908b1cd9964b86552783aed3ffdefe99b56a2d2dbbd1e99347f551eeb3f4'),
(3,'SOCIAL_SHARE',30,'2020-06-24 10:13:47','2020-06-24 10:13:47',1,'86cd0c7b82abb89b5c838b709a768e2e2deae848f098afc6792c2f42506867d4'),
(4,'JOINING_BONUS',100,'2020-06-27 11:15:44','2020-06-27 11:15:44',1,NULL);

/*Table structure for table `registration` */

DROP TABLE IF EXISTS `registration`;

CREATE TABLE `registration` (
  `registration_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `subscription_id` int(11) DEFAULT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'PENDING',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  `coupon_id` int(11) DEFAULT NULL,
  `final_amount` int(11) DEFAULT NULL COMMENT 'Actual Amount paid by client',
  `expiry_date` datetime DEFAULT NULL,
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`registration_id`),
  KEY `subscription_id` (`subscription_id`),
  KEY `coupon_id` (`coupon_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `registration_ibfk_2` FOREIGN KEY (`subscription_id`) REFERENCES `subscription` (`subscription_id`),
  CONSTRAINT `registration_ibfk_3` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`coupon_id`),
  CONSTRAINT `registration_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=352 DEFAULT CHARSET=utf8;

/*Data for the table `registration` */

insert  into `registration`(`registration_id`,`user_id`,`subscription_id`,`status`,`created_at`,`updated_at`,`isActive`,`coupon_id`,`final_amount`,`expiry_date`,`UUID`) values 
(349,25,59,'PAID','2020-07-04 10:13:49','2020-07-04 10:13:49',1,11,1107,'2021-07-04 10:13:49','5c693653-748b-4bf2-ad5d-6aa712b63394'),
(350,80,58,'PAID','2020-07-04 10:38:02','2020-07-04 10:38:02',1,11,2214,'2021-07-04 10:38:02','5c693653-748b-4bf2-ad5d-6aa712b63394'),
(351,80,57,'PAID','2020-07-04 10:41:45','2020-07-04 10:41:45',1,11,4428,'2021-07-04 10:41:45','5c693653-748b-4bf2-ad5d-6aa712b63394');

/*Table structure for table `registration_batches` */

DROP TABLE IF EXISTS `registration_batches`;

CREATE TABLE `registration_batches` (
  `reg_batch_id` int(11) NOT NULL AUTO_INCREMENT,
  `registration_id` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) NOT NULL DEFAULT '1',
  `day_of_week` varchar(100) DEFAULT NULL,
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`reg_batch_id`),
  KEY `ForeignKey1` (`batch_id`),
  KEY `ForeignKey2` (`registration_id`),
  CONSTRAINT `ForeignKey1` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batches_id`),
  CONSTRAINT `ForeignKey2` FOREIGN KEY (`registration_id`) REFERENCES `registration` (`registration_id`)
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8;

/*Data for the table `registration_batches` */

insert  into `registration_batches`(`reg_batch_id`,`registration_id`,`batch_id`,`created_at`,`updated_at`,`isActive`,`day_of_week`,`UUID`) values 
(168,349,77,'2020-07-04 10:13:50','2020-07-04 10:13:50',1,'Monday','c21ef96c-07aa-4052-94da-b4c352fc193b'),
(169,350,58,'2020-07-04 10:38:02','2020-07-04 10:38:02',1,'','c21ef96c-07aa-4052-94da-b4c352fc193b'),
(170,351,23,'2020-07-04 10:41:46','2020-07-04 10:41:46',1,'','c21ef96c-07aa-4052-94da-b4c352fc193b');

/*Table structure for table `review` */

DROP TABLE IF EXISTS `review`;

CREATE TABLE `review` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `review` varchar(900) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) NOT NULL DEFAULT '1',
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `UUID` (`UUID`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

/*Data for the table `review` */

insert  into `review`(`review_id`,`user_id`,`event_id`,`review`,`created_at`,`updated_at`,`isActive`,`UUID`) values 
(1,82,3,'It\'s been just 15 days and I am really happy to say that I have started seeing the results with the help of trainers who are always willing to help you. Thank you for everything and heads up to all the coaches out there changing people\'s lives.','2020-05-04 13:40:07','2020-05-04 13:40:07',1,'2d8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(2,83,3,'I couldn\'t be happier with what I have achieved. My Back pain has reduced and I feel more healthy and energetic now. Fit Socials has truly taken my health and fitness to levels I never allowed myself to believe I could reach. ','2020-05-04 13:40:07','2020-05-04 13:40:07',1,'3d8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(3,84,3,'Best training and trainers I have ever had in my life. Super friendly atmosphere,Every session is different and fun.The trainers really push,motivate and help us to exceed our limits and achieve our goals. Highly recommended for all the fitness lovers irrespective of what level you are in.','2020-05-04 13:40:07','2020-05-04 13:40:07',1,'2d8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc4'),
(4,85,3,'They have an amazing trainer and make you reach your goals with a smile on their faces. I really recommend this place for you if you want to have some fun while you do your workout.','2020-05-04 13:40:07','2020-05-04 13:40:07',1,'4f8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(5,86,3,'It feels great! I am really Happy and Proud of it. I would like to thank all the trainers for their guidance and support throughout. Thank you Fit Socials.','2020-05-04 13:40:07','2020-05-04 13:40:07',1,'fm8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(6,87,3,'Just few weeks ago I was a \"couch potato\", today with the decision, expertise and sincere care of the Trainer of the Fit Socials I am more energetic, eating properly and exercise daily. The trainer is knowledgeable and has an idea of the just right exercise for any issue. Thank You Fit Socials.','2020-05-05 11:22:25','2020-05-05 11:22:25',1,'438af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(7,88,3,'What an amazing experience, the support, advice and guidance you give throughout your online course work are superb. The instructor is fabulous they make it fun in among st the workout. Thank you Fit Socials','2020-05-05 11:22:25','2020-05-05 11:22:25',1,'3w8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(8,89,3,'My experience with Fit Socials was wonderful. Online workout sessions conducted were amazing. The trainer is a very pleasant person and was very supportive and encouraging. Thank you Fit Socials.','2020-05-05 11:22:26','2020-05-05 11:22:26',1,'we8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40');

/*Table structure for table `session` */

DROP TABLE IF EXISTS `session`;

CREATE TABLE `session` (
  `session_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(100) NOT NULL,
  `JWT` varchar(200) DEFAULT NULL,
  `login_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  PRIMARY KEY (`session_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `session_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `session` */

insert  into `session`(`session_id`,`user_id`,`ip_address`,`JWT`,`login_time`,`updated_at`,`isActive`) values 
(4,45,'11.233.213.10.9','asd','2020-04-27 18:28:59','2020-04-27 18:28:59',1);

/*Table structure for table `subscription` */

DROP TABLE IF EXISTS `subscription`;

CREATE TABLE `subscription` (
  `subscription_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `days` varchar(100) NOT NULL,
  `amount` varchar(100) NOT NULL,
  `tax` varchar(100) NOT NULL COMMENT 'Should be in terms of Percentage',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  `batch_count` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL COMMENT 'DEPRICATED: Managed by Batch Table',
  `duration_unit` varchar(200) DEFAULT 'DAYS' COMMENT 'DEPRICATED: Managed by Batch Table',
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`subscription_id`),
  UNIQUE KEY `UUID` (`UUID`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `subscription_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8;

/*Data for the table `subscription` */

insert  into `subscription`(`subscription_id`,`event_id`,`days`,`amount`,`tax`,`created_at`,`updated_at`,`isActive`,`batch_count`,`duration`,`duration_unit`,`UUID`) values 
(57,3,'365','7200','2.5','2020-05-04 06:12:11','2020-05-04 06:12:11',1,1,1,'DAILY','mju90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(58,3,'180','3600','2.5','2020-05-04 06:12:33','2020-05-04 06:12:33',1,1,1,'DAILY','ecb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(59,3,'90','1800','2.5','2020-05-04 06:13:02','2020-05-04 06:13:02',1,1,1,'DAILY','fcb90e2wdc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(60,3,'30','895','4','2020-05-04 06:13:27','2020-05-04 06:13:27',1,4,1,'DAILY','89i90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(67,38,'1','150','2.5','2020-05-26 10:12:01','2020-05-26 10:12:01',1,1,1,'WEEKLY','wsb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(68,38,'3','375','2.5','2020-05-26 10:12:01','2020-05-26 10:12:01',1,1,1,'WEEKLY','dfb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(69,38,'5','550','2.5','2020-05-26 10:12:01','2020-05-26 10:12:01',0,1,1,'WEEKLY','efb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(70,38,'1','0','0','2020-06-02 10:18:27','2020-06-02 10:18:27',0,1,1,'WEEKLY','rrb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(73,3,'0','0','0','2020-06-05 09:14:05','2020-06-05 09:14:05',0,1,1,'DAILY','mjk90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(74,3,'10','200','2','2020-06-05 10:02:34','2020-06-05 10:02:34',0,1,1,'DAILY','mki90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(76,41,'30','300','2','2020-06-06 09:23:00','2020-06-06 09:23:00',1,1,1,'DAILY','edb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(84,47,'72','10500','3','2020-06-13 04:12:49','2020-06-13 04:12:49',1,1,1,'DAILY','2d8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(88,3,'10','20000','2','2020-06-22 11:50:36','2020-06-22 11:50:36',0,1,NULL,'DAILY','f432b583-9556-4d20-a038-b19da8284921'),
(96,3,'15','2567','4','2020-06-22 12:17:09','2020-06-22 12:17:09',0,1,0,'DAILY','59ef1a44-ba57-4094-9045-f542a9793a75'),
(99,3,'365','5000','2.5','2020-06-22 15:46:18','2020-06-22 15:46:18',0,1,NULL,'DAILY','fcb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(100,38,'25','800','2','2020-06-26 06:03:42','2020-06-26 06:03:42',1,10,NULL,'DAILY','08193e22bc41e58095192ff048cac20e5223a326634b1558d006c2af577e8e82'),
(101,38,'15','500','2','2020-06-26 06:24:55','2020-06-26 06:24:55',1,5,NULL,'DAILY','d86639b0a2626b66efbafb48d9ef71eb71a6bf31f36c1d83e9158ff8a62f36a3'),
(102,38,'100','5000','2','2020-06-26 07:01:57','2020-06-26 07:01:57',0,2,1,'DAILY','08c54b59218719ad61ef93c1644c394dbc82b8304c311dec0c63285344860bd0'),
(103,49,'10','200','2.5','2020-06-29 04:54:25','2020-06-29 04:54:25',1,1,1,'DAILY','73a3a96cf22db4bdede45a4e7684f16b4f97b65fab1267d34ad908aa5a7ee817'),
(104,3,'10','200','2','2020-06-29 05:23:17','2020-06-29 05:23:17',0,10,0,'DAILY','2670a7b1df2349ea500931014f79d6c75805aa8c081f8cc268bba7e7fe669139'),
(105,3,'100','170','3','2020-06-29 05:41:22','2020-06-29 05:41:22',0,4,0,'DAILY','f112c9a713878db9476fb90aade527a1364167c8f60a7deef6e4583dcbe952dd'),
(106,49,'10','200','2.5','2020-07-04 07:07:28','2020-07-04 07:07:28',1,1,1,'DAILY','038a7d057d83dd1cf835cbfd97edcb8eff6199f7f380a99eaefa35c58108c525'),
(107,3,'30','300','3','2020-07-04 07:11:21','2020-07-04 07:11:21',0,5,0,'DAILY','0059505bcc2480110af17d4aa92b84e9e21ebdbb3b50829016a1ef0bf03e3044');

/*Table structure for table `test` */

DROP TABLE IF EXISTS `test`;

CREATE TABLE `test` (
  `slno` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uname` varchar(50) DEFAULT NULL COMMENT 'plain text',
  `pass` varchar(64) DEFAULT NULL COMMENT 'SHA256 Hashed String',
  PRIMARY KEY (`slno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `test` */

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_role_id` int(11) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `diaplay_name` varchar(100) NOT NULL,
  `mobile_number` varchar(30) NOT NULL,
  `email_id` varchar(100) NOT NULL,
  `profile_picture_url` varchar(500) DEFAULT NULL,
  `referral_code` varchar(200) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  `gender` varchar(10) DEFAULT 'N/A' COMMENT 'N/A, MALE, FEMALE or OTHERS',
  `dob` datetime DEFAULT NULL COMMENT 'Date of Birth',
  `designation` varchar(45) DEFAULT NULL,
  `expertise_in` varchar(900) DEFAULT NULL,
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UNIQUE` (`email_id`),
  UNIQUE KEY `UUID` (`UUID`),
  KEY `user_role_id` (`user_role_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`user_role_id`) REFERENCES `user_role_master` (`user_role_id`),
  CONSTRAINT `user_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=623 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`user_id`,`user_role_id`,`address_id`,`diaplay_name`,`mobile_number`,`email_id`,`profile_picture_url`,`referral_code`,`created_at`,`updated_at`,`isActive`,`gender`,`dob`,`designation`,`expertise_in`,`UUID`) values 
(25,3,25,'Vikram S','9898989896','vikram@gmail.com','https://i.ibb.co/9qFKLrr/viking-5164299-480.png','4f8af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40','2020-04-21 13:31:39','2020-04-21 13:31:39',1,'Male','1997-03-03 00:00:00',NULL,NULL,'54be3e63662186e5aa2aae20c4f3d8b4a43476ed204a3d81d6298d95eaea1a4f'),
(45,6,25,'Sriharsha C R','9876543212','sriharsha.cr@maiora.co','https://fit-social-backend.herokuapp.com/uploads/users/45/IMG_20200412_141047.jpg','fe92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c','2020-04-24 15:08:16','2020-04-24 15:08:16',1,'Male','1992-03-04 00:00:00',NULL,NULL,'fe92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(76,1,NULL,'Admins','9535798381','admin@gmail.com','https://cdn.pixabay.com/photo/2017/10/07/14/50/knight-2826704__480.jpg','9c3531b786283db33fc59d981db34ce083249acf6f83b84d8e5062cb9i894f84','2020-04-28 05:22:02','2020-04-28 05:22:02',1,'MALE','1992-03-04 00:00:00',NULL,NULL,'9c3531b786283db33fc59d981db34ce083249acf6f83b84d8e5062cb9i894f84'),
(77,3,NULL,'anna','987654321','anishas1234567890@gmail.com',NULL,'438af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40','2020-04-29 11:10:47','2020-04-29 11:10:47',0,'FEMALE','1992-03-04 00:00:00',NULL,NULL,'438af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(80,3,NULL,'Harsha','9876543212','sriharsha.cr92@gmail.com','http://127.0.0.1:8981/uploads/users/80/1405662422829.jpg','438af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc4e','2020-04-29 17:04:42','2020-04-29 17:04:42',1,'Male','1992-03-04 00:00:00',NULL,NULL,'438af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc4e'),
(81,3,NULL,'Ajay','9236778554','surya1@gmail.com','http://fit-social-backend.herokuapp.com/uploads/users/81/OurServices1.JPG',NULL,'2020-04-30 13:50:33','2020-04-30 13:50:33',1,'Male','1992-03-04 00:00:00',NULL,NULL,'mj4673b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(82,3,NULL,'Kavitha','9876543210','kavtha@gmail.com','https://maiora-images.maiora.co/FITSOCIAL/review/Kavitha.jpg',NULL,'2020-05-04 13:00:42','2020-05-04 13:00:42',1,'Female','1992-03-04 00:00:00','Entrepreneur',NULL,'mjt563b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(83,3,NULL,'Harshitha','9876543210','harshitha@gmail.com','https://maiora-images.maiora.co/FITSOCIAL/review/HarshithaVineeth.jpg',NULL,'2020-05-04 13:03:05','2020-05-04 13:03:05',1,'Female','1992-03-04 00:00:00','Bank Employee',NULL,'q38af3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(84,3,NULL,'Harish','9876543210','harish@gmail.com','https://maiora-images.maiora.co/FITSOCIAL/review/HarishK.jpg',NULL,'2020-05-04 13:04:22','2020-05-04 13:04:22',1,'Male','1992-03-04 00:00:00','Business Man',NULL,'mjy673b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(85,3,NULL,'Deepa','9876543210','deepa@gmail.com','https://maiora-images.maiora.co/FITSOCIAL/review/DeepaSharath.jpg',NULL,'2020-05-04 13:05:10','2020-05-04 13:05:10',1,'Female','1992-03-04 00:00:00','Beautician',NULL,'asw233b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(86,3,NULL,'Usha','9876543210','usha@gmail.com','https://maiora-images.maiora.co/FITSOCIAL/review/Usha.jpg',NULL,'2020-05-04 13:06:00','2020-05-04 13:06:00',0,'Female','1992-03-04 00:00:00','Housewife',NULL,'mkiol3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(87,3,NULL,'Prashanth','9876543210','prashanth@gmail.com','https://maiora-images.maiora.co/FITSOCIAL/review/Prashanth.jpg',NULL,'2020-05-04 13:32:30','2020-05-04 13:32:30',1,'Male','1992-03-04 00:00:00','Business Man',NULL,'mjksf3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40'),
(88,3,NULL,'Shalini','9876543210','shalini@gmail.com','https://maiora-images.maiora.co/FITSOCIAL/review/Shalini.jpg',NULL,'2020-05-04 13:33:18','2020-05-04 13:33:18',1,'Female','1992-03-04 00:00:00','Housewife',NULL,'fe92d4w04b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(89,3,NULL,'Bharath','9876543210','bharath@gmail.com','https://maiora-images.maiora.co/FITSOCIAL/review/Bharath.jpg',NULL,'2020-05-04 13:34:03','2020-05-04 13:34:03',0,'Male','1992-03-04 00:00:00','Sales Executive',NULL,'ae92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(103,6,NULL,'surya AM','9999999999','ajay.jp@maiora.co','https://cdn.pixabay.com/photo/2019/12/09/11/31/man-4683311__480.jpg',NULL,'2020-05-18 11:02:25','2020-05-18 11:02:25',1,'Male','1997-06-11 00:00:00',NULL,'<ul><li>Hatha</li><li>Vinyasa</li><li>Power</li><li>Yin</li> <li>Pranayama</li><li>Meditation</li><li>Yoga Nidra</li><li>Deep stretch</li></ul>','se92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(111,6,NULL,'Chethan Hanabe','9886622676','chethan.hm@gmail.com','https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584__480.png',NULL,'2020-05-25 15:00:32','2020-05-25 15:00:32',1,'MALE','1992-03-04 00:00:00',NULL,'<ul><li>Hatha</li><li>Vinyasa</li><li>Power</li><li>Yin</li> <li>Pranayama</li><li>Meditation</li><li>Yoga Nidra</li><li>Deep stretch</li></ul>','sdw3d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(112,6,NULL,'Praveen Kumar','7892891430','praveenkumar@gmail.com','https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584__480.png',NULL,'2020-05-25 15:33:36','2020-05-25 15:33:36',1,'MALE','1992-03-04 00:00:00',NULL,'<ul><li>No Gym Equipments</li><li>Head to Toe simple exercises</li><li>BodyWeight upper body workout</li><li>BodyWeight lower body workout</li><li>Ground Workouts</li><li>Fitness Challenges</li><li>Strength & Endurance workouts</li></ul>','sd92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(281,6,NULL,'Trainer','9876543210','sriharsha.cr921@gmail.com','https://img1.looper.com/img/gallery/things-that-make-no-sense-about-harry-potter/intro-1550086067.jpg','mk92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c','2020-05-31 14:14:09','2020-05-31 14:14:09',0,'Male','2020-05-09 00:00:00',NULL,NULL,'mk92d4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(492,6,NULL,'Arno Victor Dorian','8197681194','gwyndovah@gmail.com','http://fit-social-backend.herokuapp.com/uploads/users/492/97125.jpg','mjiod4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c','2020-06-11 08:32:59','2020-06-11 08:32:59',0,'Male',NULL,NULL,NULL,'mjiod4004b9f1edef174a70e820dd012cb5691e833dff76d3b5d80cfe534c18c'),
(555,3,NULL,'Ashritha','+91 1234567890','ashritha.shetty@maiora.co',NULL,'mkiol3b0b08a4be31793c9524e1856b43d8d43b41c94d029496e87f36bc7dc40','2020-06-26 12:28:31','2020-06-26 12:28:31',0,'FEMALE','2020-06-26 18:30:00',NULL,NULL,'ac1a2f8d227876573aeebdacff7fae5af9ed9373bfaad75c830f2d66f1d6704e'),
(557,3,NULL,'Harsha','+91 9535798381','cr.sriharsha1@gmail.com',NULL,'680fea664361be1fc258dd6c4452670538623c839333cecd32cdfde4ae516a64','2020-06-26 13:33:01','2020-06-26 13:33:01',1,'MALE','1992-03-03 18:30:00',NULL,NULL,'680fea664361be1fc258dd6c4452670538623c839333cecd32cdfde4ae516a64'),
(562,3,NULL,'ROY M','+91 9535798381','roy.monteiro12@maiora.co',NULL,'a3686672fc5a9481b69c068abb41e1c7e651bbc617174726e719419d76b5773d','2020-06-26 13:50:26','2020-06-26 13:50:26',0,'MALE','1998-03-03 18:30:00',NULL,NULL,'a3686672fc5a9481b69c068abb41e1c7e651bbc617174726e719419d76b5773d'),
(563,3,NULL,'ROY M','+91 9535798381','roy.monteiro12s@maiora.co',NULL,'8aa70c5b0e71ba38f093aa75c74e406ff613f0f921e84ce853cf812572d05fe7','2020-06-26 13:54:34','2020-06-26 13:54:34',0,'MALE','1998-03-03 18:30:00',NULL,NULL,'8aa70c5b0e71ba38f093aa75c74e406ff613f0f921e84ce853cf812572d05fe7'),
(564,3,NULL,'Dhanush','+91 9535798381','dhanush.kumar@maiora.co',NULL,'e470f2bad7d38f895be768f6de727719a265bcfd36a69fafc979de1fa4302aef','2020-06-26 13:57:30','2020-06-26 13:57:30',0,'MALE','1998-03-03 18:30:00',NULL,NULL,'e470f2bad7d38f895be768f6de727719a265bcfd36a69fafc979de1fa4302aef'),
(565,3,NULL,'Dhanush','+91 9535798381','dhanush.kumars@maiora.co',NULL,'93d49610c923e851b1da68a350c7b274d4830938bcbfadc48da487d9026e04bd','2020-06-26 13:58:25','2020-06-26 13:58:25',0,'MALE','1998-03-03 18:30:00',NULL,NULL,'93d49610c923e851b1da68a350c7b274d4830938bcbfadc48da487d9026e04bd'),
(566,3,NULL,'Harsha','+91 9535798381','cr.sriharsha@mariora.co',NULL,'4c0047ddbdb82da6d6b3fb9cf89fedb6433323d008c6efb9c8adc783e6c9a6c0','2020-06-27 11:27:57','2020-06-27 11:27:57',0,'MALE','1992-03-03 18:30:00',NULL,NULL,'4c0047ddbdb82da6d6b3fb9cf89fedb6433323d008c6efb9c8adc783e6c9a6c0'),
(567,3,NULL,'Darshan','9879877654','ajayjp1997@gmail.com',NULL,'eb5d2feb30413826d1680cf33464fba89167aaef3bd04907b6b8deed14df404d','2020-06-27 13:59:57','2020-06-27 13:59:57',0,'Male',NULL,NULL,NULL,'eb5d2feb30413826d1680cf33464fba89167aaef3bd04907b6b8deed14df404d'),
(568,6,NULL,'pruthwi','9876876547','pks@gmail.com',NULL,'a3dc702a5733e0111476284dea664577d692e8c3d919a61b346943944a33ca24','2020-06-27 14:03:52','2020-06-27 14:03:52',0,'Male',NULL,NULL,NULL,'a3dc702a5733e0111476284dea664577d692e8c3d919a61b346943944a33ca24'),
(569,3,NULL,'Akash','9876576543','akash@gmail.com',NULL,'371bcafc7e04d7cadf6619bbbb251f2a14e93b09f77c92b10139892eba5c93af','2020-06-27 14:12:10','2020-06-27 14:12:10',0,'Male',NULL,NULL,NULL,'371bcafc7e04d7cadf6619bbbb251f2a14e93b09f77c92b10139892eba5c93af'),
(607,3,NULL,'Harsha','9345798381','asdasd.crfdssdf@mariora.co',NULL,'2681c5534801bf859b18af51f155928aa03dee3790ca116cc0f83769e7291c7a',NULL,NULL,0,'Male',NULL,'SRSE',NULL,'2681c5534801bf859b18af51f155928aa03dee3790ca116cc0f83769e7291c7a'),
(608,3,NULL,'Harsha','98763453210','cr.adsrihaasdrshasdsdfs@gmail.com',NULL,'f9aefcd4cee0c217300894c65ab6f88de8d68d8c9bcfd26f400345ffc24ffccb',NULL,NULL,0,'Male',NULL,'SRSE',NULL,'f9aefcd4cee0c217300894c65ab6f88de8d68d8c9bcfd26f400345ffc24ffccb'),
(609,3,NULL,'Swathi','9876543210','swfsdfawethi@gmail.com',NULL,'6368776084cbfff09e1964bb00e2195fcd1294e0cae49e0410b42fbe58693b77',NULL,NULL,1,'Female',NULL,'SRSE',NULL,'6368776084cbfff09e1964bb00e2195fcd1294e0cae49e0410b42fbe58693b77'),
(610,3,NULL,'Kishore','9873453210','kishoresdfsdf@gmail.com',NULL,'c734a45342d624a0646151c523007e8a9f1e2d668362e7f197bc386257fd4546',NULL,NULL,1,'Male',NULL,'SRSE',NULL,'c734a45342d624a0646151c523007e8a9f1e2d668362e7f197bc386257fd4546'),
(611,3,NULL,'Deepthi','9876543210','defsdfepthi@gmail.com',NULL,'29a46aebc00a6601c36fc4de0d367bff00cc73f5a8f753d90d6d43178bfe892d',NULL,NULL,1,'Female',NULL,'SRSE',NULL,'29a46aebc00a6601c36fc4de0d367bff00cc73f5a8f753d90d6d43178bfe892d'),
(612,3,NULL,'Pooja','9876345210','asdasd@gmail.com',NULL,'862c1ce56a16adcd15d3a3d9c6e42b85a7cfd10edb3c75bdb18f842d04734350',NULL,NULL,1,'Female',NULL,'SRSE',NULL,'862c1ce56a16adcd15d3a3d9c6e42b85a7cfd10edb3c75bdb18f842d04734350'),
(620,6,NULL,'arjun','9876587654','arman@gmail.com',NULL,'d75a9749f53e3bb6c3a3903b8e72b30b9fbfed419dc3ed68dab8e5e72c8ce972','2020-07-04 10:03:28','2020-07-04 10:03:28',0,'Male',NULL,NULL,NULL,'d75a9749f53e3bb6c3a3903b8e72b30b9fbfed419dc3ed68dab8e5e72c8ce972'),
(621,6,NULL,'amraan','9876876545','kjkjkj@gmail.com',NULL,'2ada827acac953874388eb4d293afa80c39638cc4d621c3c0962a6de95058a02','2020-07-04 10:05:57','2020-07-04 10:05:57',0,'Male',NULL,NULL,NULL,'2ada827acac953874388eb4d293afa80c39638cc4d621c3c0962a6de95058a02'),
(622,6,NULL,'harshal','9878767654','hasss@gmail.com',NULL,'d174146a114bfcfffc81cf4720e5f660bcab2b7ed2140cd6e3cb37371624a668','2020-07-04 10:09:07','2020-07-04 10:09:07',0,'Male',NULL,NULL,NULL,'d174146a114bfcfffc81cf4720e5f660bcab2b7ed2140cd6e3cb37371624a668');

/*Table structure for table `user_points` */

DROP TABLE IF EXISTS `user_points`;

CREATE TABLE `user_points` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(64) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `credited_points` int(11) NOT NULL DEFAULT '0',
  `debited_points` int(11) NOT NULL DEFAULT '0',
  `comment` varchar(100) DEFAULT 'null',
  `isActive` int(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `balance_points` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ForeignKey` (`user_id`),
  CONSTRAINT `ForeignKey` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

/*Data for the table `user_points` */

insert  into `user_points`(`id`,`uuid`,`user_id`,`credited_points`,`debited_points`,`comment`,`isActive`,`created_at`,`updated_at`,`balance_points`) values 
(24,'cb48f9d652361c0f9cfa32cd6e8647d01d0b99f430bc802086ef1e4de6924a7d',557,0,0,'SignUp',1,'2020-06-27 15:13:36','2020-06-27 15:13:36',0),
(25,'9b19dfc9537bdc31256aa238ac0bfbf52850cd276fc3ef36c62989a81626dd56',557,10,5,'Referral Bonus',1,'2020-06-27 15:15:42','2020-06-27 15:15:42',5),
(26,'8a50a65003634f209f42bcd75c7bfc2150073cd2cc24fea69f895c2eb8cd73f7',557,10,5,'Bug Bounty',1,'2020-06-27 15:15:46','2020-06-27 15:15:46',10),
(27,'3997f96bd87c5c3ec3ac07eade89ec67a81cfe4eb50985431bb210545fb325c2',557,10,0,'Social Share Start',1,'2020-06-27 15:15:56','2020-06-27 15:15:56',20),
(28,'a6ff37471d9cf0e5e361c9431b2ce27671b64d20aa52caa630e451da34870543',557,0,5,'Warning for Wrong Doing during the Activity',1,'2020-06-27 15:16:04','2020-06-27 15:16:04',15),
(29,'a6ff37471d9cf0e5e361c9431b2ce27671b64d20aa52caa630e451da34870545',25,10,0,'Bug Bounty',1,'2020-07-03 13:32:20','2020-07-03 13:32:20',10);

/*Table structure for table `user_referrals` */

DROP TABLE IF EXISTS `user_referrals`;

CREATE TABLE `user_referrals` (
  `referral_id` int(11) NOT NULL AUTO_INCREMENT,
  `referrering_user` int(11) NOT NULL COMMENT 'User who is already there and refers',
  `invited_user` int(11) NOT NULL COMMENT 'New user being invited',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) NOT NULL DEFAULT '1',
  `UUID` varchar(100) DEFAULT NULL,
  `points_gained` int(11) DEFAULT '200',
  PRIMARY KEY (`referral_id`),
  UNIQUE KEY `ForeignKey2` (`invited_user`),
  UNIQUE KEY `UUID` (`UUID`),
  KEY `ForeignKey1` (`referrering_user`),
  CONSTRAINT `ForeignKeyConstraint1` FOREIGN KEY (`referrering_user`) REFERENCES `user` (`user_id`),
  CONSTRAINT `ForeignKeyConstraint2` FOREIGN KEY (`invited_user`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

/*Data for the table `user_referrals` */

insert  into `user_referrals`(`referral_id`,`referrering_user`,`invited_user`,`created_at`,`updated_at`,`isActive`,`UUID`,`points_gained`) values 
(1,76,45,'2020-05-30 05:17:24','2020-05-30 05:17:24',1,'fcb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4',200),
(2,83,77,'2020-05-30 05:17:33','2020-05-30 05:17:33',1,'ecb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4',200),
(3,45,80,'2020-05-30 05:18:20','2020-05-30 05:18:20',1,'wwb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4',200),
(5,45,85,'2020-05-30 06:19:30','2020-05-30 06:19:30',0,'wsb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4',200),
(9,45,25,'2020-06-22 15:55:54','2020-06-22 15:55:54',1,'344763af3142d50116944b0e2bb7d562ceb0ddb5a5f16d8aac5dd0cd19ec1bbb',200),
(13,86,555,'2020-06-26 12:28:32','2020-06-26 12:28:32',1,'4f29f4772a41680653bfd2a518657b599763d608b35efee5cc63d5ac00fef37d',200),
(14,86,557,'2020-06-26 13:33:03','2020-06-26 13:33:03',1,'9de41a05bb2bcf8a49cde6a8c2fb4496dc76790d37580d3b88f2a766601d7222',200),
(19,557,563,'2020-06-26 13:54:36','2020-06-26 13:54:36',1,'72a7e5107a6bdd78cad3abc8509fdff39287fceb34a67f3e64ddd479d8e10dd8',200),
(20,555,564,'2020-06-26 13:57:32','2020-06-26 13:57:32',1,'95682d08b804e619f3b38af8deb7b549a65008cb5fc99e1ab418b9ac20b64bd1',200),
(21,557,565,'2020-06-26 13:58:28','2020-06-26 13:58:28',1,'38efc1c42002764140fb03c9a05757d26b19e51a68496bbbad46b44ff18474d6',200),
(22,45,566,'2020-06-27 11:27:58','2020-06-27 11:27:58',1,'6270346e2f94e5e388c74e93bf5dd5668f40b50d8d45b92253193af5cc5aa9e7',200),
(23,103,569,'2020-06-27 14:12:11','2020-06-27 14:12:11',1,'fc86ab463819ff8fb74310a1d824409000fbeedcadc06529bd449bf81014d8bf',200),
(39,45,607,'2020-06-27 16:16:18','2020-06-27 16:16:18',1,'bd610d366446d318641ec713da72802b2685e191060f4f21344539cdd10f4d47',200),
(40,45,608,'2020-06-27 16:16:18','2020-06-27 16:16:18',1,'f73a416af6a9a30fcecd5ad039603da6b3a135c50586bb10999d5680cfe5f5a4',200),
(41,45,609,'2020-06-27 16:16:18','2020-06-27 16:16:18',1,'87061bc774bfeae1ca805a436fdac2abf6b95af62c218f5cadac88f8b64e0679',200),
(42,45,610,'2020-06-27 16:16:18','2020-06-27 16:16:18',1,'1829e8a7c69ad88ea6568fc0affc689692bc8aa04df3c5f76dae535e8f470ddb',200),
(43,45,611,'2020-06-27 16:16:18','2020-06-27 16:16:18',1,'7bdf511b11b1be0a903ac2c0ca898a0650f51f83997d8e34042e05488b9e90d2',200),
(44,45,612,'2020-06-27 16:16:18','2020-06-27 16:16:18',1,'811e6eb1b19ffb2e92f5ea0dd38a7997fa8f57bb94111287c72381b58cf8365e',200);

/*Table structure for table `user_role_master` */

DROP TABLE IF EXISTS `user_role_master`;

CREATE TABLE `user_role_master` (
  `user_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(1) DEFAULT '1',
  `UUID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_role_id`),
  UNIQUE KEY `UNIQUE` (`role_name`) COMMENT 'User Role names must be Unique',
  UNIQUE KEY `UUID` (`UUID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `user_role_master` */

insert  into `user_role_master`(`user_role_id`,`role_name`,`created_at`,`updated_at`,`isActive`,`UUID`) values 
(1,'ADMIN','2020-04-19 15:08:14','2020-04-19 15:08:14',1,'fcb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(2,'GUEST','2020-04-28 13:02:32','2020-04-28 13:02:32',1,'3cb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(3,'CLIENT','2020-04-19 15:08:23','2020-04-19 15:08:23',1,'acb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(4,'MANAGER','2020-04-19 15:44:57','2020-04-19 15:44:57',1,'ecb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(5,'TESTER','2020-04-27 18:18:11','2020-04-27 18:18:11',1,'wcb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4'),
(6,'INSTRUCTOR','2020-04-29 06:29:37','2020-04-29 06:29:37',1,'zcb90e2ddc23a936bb8098cf3b4f56d34da0a2d88b3c060bcedff07ce7a01fd4');

/* Trigger structure for table `registration_batches` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `on_insert_decz_seats` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'maiora'@'%' */ /*!50003 TRIGGER `on_insert_decz_seats` AFTER INSERT ON `registration_batches` FOR EACH ROW BEGIN
    
    UPDATE batches SET available_seats = GREATEST( 0, available_seats - 1) WHERE batches_id = new.batch_id;

    END */$$


DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
