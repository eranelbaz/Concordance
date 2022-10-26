import { saveWordsOfDocument } from './db/stores/words';
import { saveDocument, queryDocument } from './db/stores/documents';
import { InputDocument } from 'api';

export const loadDocument = async (document: InputDocument) => {
  const isDocumentExists = !(await queryDocument(document));
  if (!isDocumentExists) {
    console.log(`Skipping`, { document });
  } else {
    console.log(`Loading`, { document });
    const songId = await saveDocument(document);

    const lines = document.content.split('\n');
    const words = lines.map(line => line.split(' '));
    await saveWordsOfDocument(words, songId);
  }
};
