import { loadDocument } from './load-document';

loadDocument(`
author,title,album,year,content
author,title,album,year,content
`).then(r => console.log(r));
