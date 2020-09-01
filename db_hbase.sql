/*
Navicat MySQL Data Transfer

Source Server         : 7a
Source Server Version : 50731
Source Host           : aaaaaaa.club:3306
Source Database       : db_hbase

Target Server Type    : MYSQL
Target Server Version : 50731
File Encoding         : 65001

Date: 2020-08-29 19:09:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for t_jmx
-- ----------------------------
DROP TABLE IF EXISTS `t_jmx`;
CREATE TABLE `t_jmx` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NULL DEFAULT NULL,
  `sys` longblob,
  `server` longblob,
  `table` longblob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=334 DEFAULT CHARSET=utf8mb4;
