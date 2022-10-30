import { uuid } from 'uuidv4';
import { DocumentMetadata, InputDocument } from '../../api';
import { Metadata } from '../models';
import { execute } from './common';
export const storeMetadata = async (documentId: string, { album, year, title, author }: InputDocument) =>
  execute(
    `
INSERT INTO metadata (id, name, value, documentId) VALUES
                ('${uuid()}', 'album', '${album}', '${documentId}'),
                ('${uuid()}', 'year', '${year}',   '${documentId}'),
                ('${uuid()}', 'title', '${title}', '${documentId}'),
                ('${uuid()}', 'author', '${author}','${documentId}');
`
  );

export const getMetadataByDocumentId = async (document: Partial<DocumentMetadata>) => {
  let sql = 'SELECT * FROM metadata WHERE ';
  const wheres: string[] = [];
  if (document.author) {
    wheres.push(`name = 'author' and value = '${document.author}'`);
  }
  if (document.title) {
    wheres.push(`name = 'title' and value = '${document.title}'`);
  }
  if (document.album) {
    wheres.push(`name = 'album' and value = '${document.album}'`);
  }
  if (document.year) {
    wheres.push(`name = 'year' and value = '${document.year}'`);
  }
  sql = sql.concat(wheres.join(' AND '));
  const [yearData] = (await execute(sql)) as [Metadata[], any];
  const data = (
    await Promise.all(yearData.map(d => execute(`SELECT * from metadata where documentId = '${d.documentId}'`)))
  ).map(([data]) => data) as Metadata[][];

  const groupedData = {};
  data?.forEach(metadataByDocumentId => {
    metadataByDocumentId.forEach(metadata => {
      const group = groupedData[metadata.documentId] || {};
      group[metadata.name] = metadata.value;
      groupedData[metadata.documentId] = group;
    });
  });
  console.log(groupedData);
  return groupedData;
};
