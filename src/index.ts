import dotenv from 'dotenv';
dotenv.config();
console.log(process.env); // remove this after you've confirmed it working

import { loadDocument } from './load-document';

loadDocument(`author,title,album,year,content
a,b,c,d,e
`).then(r => r);
