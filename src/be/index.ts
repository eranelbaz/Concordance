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
import express from 'express';

const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
