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
import { getMetadata, getMetadataByDocumentId } from './db/stores/metadata';
import { getDocumentWords, queryMetadataOfWords } from './db/stores/words';
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
  const documentIds = req.body.documentIds;
  console.log('getting words for documents', { documentIds });

  const words = await getDocumentWords(documentIds);
  const metadata = await getMetadataByDocumentId(documentIds);
  res.json({ words, metadata });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
