CREATE DATABASE concordance;
USE concordance;

CREATE TABLE `documents` (
  `id` varchar(36) PRIMARY KEY AUTO_INCREMENT,
  `path` varchar(255) NOT NULL
);

CREATE TABLE `metadata` (
  `id` varchar(36) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `documentId` int NOT NULL,
  FOREIGN KEY (documentId) REFERENCES `documents`(id)
);

CREATE TABLE `words` (
  `id` varchar(36) PRIMARY KEY AUTO_INCREMENT,
  `word` varchar(255) NOT NULL,
  UNIQUE (word)
);

CREATE TABLE `wordsToDocuments` (
  `id` varchar(36) PRIMARY KEY AUTO_INCREMENT,
  `wordId` int,
  `documentId` int,
  FOREIGN KEY (wordId) REFERENCES `words`(id),
  FOREIGN KEY (documentId) REFERENCES `documents`(id)
  UNIQUE (wordId,documentId)
);

CREATE TABLE `groupsTypes` (
  `id` varchar(36) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);


CREATE TABLE `groups` (
  `id` varchar(36) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` int,
  FOREIGN KEY (type) REFERENCES `groupsTypes`(id)
);

CREATE TABLE `groupsToWords` (
  `id` varchar(36) PRIMARY KEY AUTO_INCREMENT,
  `groupId` int,
  `wordId` int,
  FOREIGN KEY (wordId) REFERENCES `words`(id),
  FOREIGN KEY (groupId) REFERENCES `groups`(id)
);

CREATE USER 'concordance'@'localhost' IDENTIFIED WITH mysql_native_password BY 'concordance';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON concordance.* TO 'concordance'@'localhost';
