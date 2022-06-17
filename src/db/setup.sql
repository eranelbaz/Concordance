CREATE DATABASE concordance;
USE concordance;

CREATE TABLE `documents` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `path` varchar(255) NOT NULL
);

CREATE TABLE `metadata` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `documentId` int NOT NULL,
  FOREIGN KEY (documentId) REFERENCES `documents`(id)
);

CREATE TABLE `words` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `word` varchar(255) NOT NULL
);

CREATE TABLE `wordsToDocuments` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `wordId` int,
  `documentId` int,
  FOREIGN KEY (wordId) REFERENCES `words`(id),
  FOREIGN KEY (documentId) REFERENCES `documents`(id)
);

CREATE TABLE `groupsTypes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);


CREATE TABLE `groups` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` int,
  FOREIGN KEY (type) REFERENCES `groupsTypes`(id)
);

CREATE TABLE `groupsToWords` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `groupId` int,
  `wordId` int,
  FOREIGN KEY (wordId) REFERENCES `words`(id),
  FOREIGN KEY (groupId) REFERENCES `groups`(id)
);