import { uuid } from 'uuidv4';
import { Group } from '../models';
import { execute } from './common';
import { queryWord } from './words';

export const getGroups = async () => {
  const sql = 'SELECT * FROM `groups`';
  const [groups] = (await execute(sql)) as [Group[], any];

  return groups;
};

export const queryGroupByName = async (name: string) => {
  const data = await execute(`SELECT * FROM \`groups\` WHERE name = '${name}'`);
  return data[0][0] as Group;
};

export const createGroup = async (name: string, words: string[]) => {
  const groupDBData = await queryGroupByName(name);
  const isGroupExists = !!groupDBData;
  if (isGroupExists) {
    throw new Error('group name exists');
  }
  const wordsFromDB = await Promise.all(
    words.map(async word => {
      const wordDBData = await queryWord(word);
      const isWordExists = !!wordDBData;
      if (!isWordExists) {
        throw new Error(`word does not exists - ${word}`);
      } else {
        return wordDBData;
      }
    })
  );
  const groupUuid = uuid();
  await execute(`INSERT INTO \`groups\` (id, name) VALUES ('${groupUuid}','${name}')`);
  await Promise.all(
    wordsFromDB.map(async word => {
      await execute(
        `INSERT INTO \`groupsToWords\` (id,groupId,wordId) VALUES ('${uuid()}','${groupUuid}','${word.id}')`
      );
    })
  );
};
