import { uuid } from 'uuidv4';
import { Group, GroupToWords } from '../models';
import { execute } from './common';
import { queryWord } from './words';

export const getGroups = async () => {
  const sql = 'SELECT * FROM `groups`';
  const [groups] = (await execute(sql)) as [Group[], any];

  return groups;
};

export const getWordsInGroups = async (groupId: string) => {
  const sql = `SELECT groupId,wordId,word FROM \`groupsToWords\` join \`words\`  where groupId = '${groupId}' and \`groupsToWords\`.wordId = \`words\`.id`;
  const [groups] = (await execute(sql)) as [GroupToWords[], any];

  return groups;
};

export const queryGroupByName = async (name: string) => {
  const data = await execute(`SELECT * FROM \`groups\` WHERE name = '${name}'`);
  return data[0][0] as Group;
};

export const createGroup = async (name: string, words: string[]) => {
  const groupDBData = await queryGroupByName(name);
  const isGroupExists = !!groupDBData;
  const wordsInGroup = isGroupExists ? await getWordsInGroups(groupDBData.id) : [];
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
  const groupUuid = isGroupExists ? groupDBData.id : uuid();
  !isGroupExists && (await execute(`INSERT INTO \`groups\` (id, name) VALUES ('${groupUuid}','${name}')`));

  await Promise.all(
    wordsFromDB.map(async word => {
      const wordInGroup = !!wordsInGroup.find(wordInGroup => wordInGroup.wordId === word.id);
      !wordInGroup &&
        (await execute(
          `INSERT INTO \`groupsToWords\` (id,groupId,wordId) VALUES ('${uuid()}','${groupUuid}','${word.id}')`
        ));
    })
  );
};
