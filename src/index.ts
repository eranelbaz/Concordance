import dotenv from 'dotenv';
import { loadDocument } from './load-document';
dotenv.config();

loadDocument(`author,title,album,year,content
a,b,c,d,e
`).then(r => r);
