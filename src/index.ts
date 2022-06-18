import dotenv from 'dotenv';
dotenv.config();

import { loadDocument } from './load-document';

loadDocument(`author,title,album,year,content
a,b,c,d,e
`).then(r => r);
