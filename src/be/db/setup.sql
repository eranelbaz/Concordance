DROP DATABASE concordance;
CREATE DATABASE concordance;
USE concordance;

CREATE TABLE `documents` (
  `id` varchar(36) PRIMARY KEY,
  `path` varchar(255) NOT NULL,
   UNIQUE (path)
);

CREATE TABLE `metadata` (
  `id` varchar(36) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `documentId` varchar(36) NOT NULL,
  FOREIGN KEY (documentId) REFERENCES `documents`(id)
);

CREATE TABLE `words` (
  `id` varchar(36) PRIMARY KEY,
  `word` varchar(255) NOT NULL,
  UNIQUE (word)
);

CREATE TABLE `wordsToDocuments` (
  `id` varchar(36) PRIMARY KEY,
  `wordId` varchar(36),
  `paragraphIndex` int,
  `paragraphLineIndex` int,
  `lineIndex` int,
  `wordIndex` int,
  `documentId` varchar(36),
  FOREIGN KEY (wordId) REFERENCES `words`(id),
  FOREIGN KEY (documentId) REFERENCES `documents`(id),
  UNIQUE (wordId,documentId)
);

CREATE TABLE `groups` (
  `id` varchar(36) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `type` varchar(36) NOT NULL,
  UNIQUE (name)
);

CREATE TABLE `groupsToWords` (
  `id` varchar(36) PRIMARY KEY,
  `groupId` varchar(36),
  `wordId` varchar(36),
  `position` int,
  FOREIGN KEY (wordId) REFERENCES `words`(id),
  FOREIGN KEY (groupId) REFERENCES `groups`(id)
);

