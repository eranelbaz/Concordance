-- Clear

DELETE FROM `documents`;
DELETE FROM `metadata`;
DELETE FROM `wordsToDocuments`;
DELETE FROM `words`;

-- get words by documents

select * from wordsToDocuments join words
on wordsToDocuments.wordId = words.id
order by documentId
