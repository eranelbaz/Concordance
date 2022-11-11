// import { loadDocument } from '@/be/load-document';
//
// const documents = [
//   {
//     author: 'firstAuthor',
//     title: 'firstTitle',
//     album: 'firstAlbum',
//     year: '1990',
//     content: 'I like Halav'
//   },
//   {
//     author: 'seconAuthor',
//     title: 'seconTitle',
//     album: 'seconAlbum',
//     year: '1990',
//     content: 'I really like Halav'
//   }
// ];
// const tasks = documents.map(doc => () => loadDocument(doc));
// runSerial(tasks);
//
// function runSerial(tasks) {
//   var result = Promise.resolve();
//   tasks.forEach(task => {
//     result = result.then(() => task());
//   });
//   return result;
// }
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { createGroup, getGroups } from './db/stores/groups';
import { getMetadata, getMetadataByDocumentId } from './db/stores/metadata';
import { getDocumentContent, getDocumentWords, getWord, queryMetadataOfWords } from './db/stores/words';
import { loadDocument } from './load-document';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/load', async (req, res) => {
  const body = req.body;
  console.log('load document', { body });

  res.send(await loadDocument(body));
});

app.post('/searchMetadata', async (req, res) => {
  const body = req.body;
  console.log('searching documents by metadata', { body });

  const documents = await getMetadata(body);

  res.json(documents);
});
app.post('/searchContent', async (req, res) => {
  const body = req.body;
  console.log('searching documents by words', { body });

  const wordsIds = await queryMetadataOfWords(body);

  res.json(wordsIds);
});
app.post('/getDocumentContent', async (req, res) => {
  const documentId = req.body.documentId;
  console.log('getting words for document', { documentId });

  const words = await getDocumentContent(documentId);
  res.json(words);
});
app.post('/getDocumentWords', async (req, res) => {
  const documentIds = req.body.documentIds;
  console.log('getting distinct words for documents', { documentIds });

  const words = await getDocumentWords(documentIds);
  res.json(words);
});

app.post('/getDocumentMetadata', async (req, res) => {
  const documentId = req.body.documentId;

  const metadata = await getMetadataByDocumentId([documentId]);
  res.json(metadata);
});
app.post('/getDocumentsMetadata', async (req, res) => {
  const documentIds = req.body.documentIds;

  const metadata = await getMetadataByDocumentId(documentIds);
  res.json(metadata);
});

app.post('/getWord', async (req, res) => {
  const wordId = req.body.wordId;
  console.log('getting word data', { wordId });

  const word = await getWord(wordId);
  res.json(word);
});

app.post('/getWordGroups', async (req, res) => {
  console.log('getting word groups');

  const groups = await getGroups();
  res.json(groups);
});
app.post('/createWordGroups', async (req, res) => {
  const { name, words } = req.body;

  console.log('creating word groups', { name, words });
  try {
    await createGroup(name, words);
    res.send('success');
  } catch (e) {
    const error = e as Error;
    res.send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
