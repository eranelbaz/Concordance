import { execute } from './db/stores/common';

export const clearDb = async () => {
  await execute('DELETE FROM `metadata`;');
  await execute('DELETE FROM `documents`;');
  await execute('DELETE FROM `wordsToDocuments`;');
  await execute('DELETE FROM `words`;');
};
