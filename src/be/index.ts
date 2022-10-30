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
import { getMetadataByDocumentId } from './db/stores/metadata';
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

app.post('/search', async (req, res) => {
  const body = req.body;
  console.log('searching documents', { body });

  const documents = await getMetadataByDocumentId(body);

  res.json(documents);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
