import { InputDocument } from './api';
import { queryDocument, saveDocument } from './db/stores/documents';
import { saveWordsOfDocument } from './db/stores/words';

export const loadDocument = async (document: InputDocument) => {
  const isDocumentExists = !(await queryDocument(document));
  if (!isDocumentExists) {
    console.log(`Skipping`, { document });
    return 'skip';
  } else {
    console.log(`Loading`, { document });
    const songId = await saveDocument(document);

    const canonizeContent = document.content
      .toLowerCase()
      .replaceAll(`'`, '')
      .replaceAll(`"`, '')
      .replaceAll(`.`, '')
      .replaceAll(',', '')
      .replaceAll('?', '')
      .replaceAll('!', '')
      .replaceAll("'", "''")
      .replaceAll('(', '')
      .replaceAll('-', ' ')
      .replaceAll(')', '');
    const splits = canonizeContent.split('\n\n').map(lines => lines.split('\n').map(line => line.split(' ')));

    await saveWordsOfDocument(splits, songId);
    return 'load';
  }
};
