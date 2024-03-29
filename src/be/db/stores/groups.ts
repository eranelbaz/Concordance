import _ from 'lodash';
import { uuid } from 'uuidv4';
import { Group, GroupToWords, GroupTypes } from '../models';
import { execute } from './common';
import { queryWord } from './words';

export const getGroups = async () => {
  const sql = 'SELECT * FROM `groups`';
  const [groups] = (await execute(sql)) as [Group[], any];

  return groups;
};

export const getWordsInGroups = async (groupId: string) => {
  const sql = `SELECT groupId, wordId, word, TYPE, position FROM \`groupsToWords\` JOIN \`words\` join \`groups\` WHERE \`groups\`.id = '${groupId}' AND \`groupsToWords\`.wordId = \`words\`.id AND \`groupsToWords\`.groupId = \`groups\`.id order by position`;
  const [groups] = (await execute(sql)) as [GroupToWords[], any];

  return groups;
};

export const queryGroupByName = async (name: string) => {
  const data = await execute(`SELECT * FROM \`groups\` WHERE name = '${name}'`);
  return data[0][0] as Group;
};

export const createGroup = async (name: string, type: GroupTypes) => {
  const groupDBData = await queryGroupByName(name);
  const isGroupExists = !!groupDBData;
  if (!isGroupExists) {
    const groupUuid = uuid();
    await execute(`INSERT INTO \`groups\` (id, name, type) VALUES ('${groupUuid}','${name}', '${type}')`);
  } else {
    throw new Error(`group exists`);
  }
};

export const insertToGroup = async (name: string, words: { word: string; position: number }[]) => {
  const groupDBData = await queryGroupByName(name);
  const isGroupExists = !!groupDBData;
  if (!isGroupExists) {
    throw new Error(`group does not exists - ${name}`);
  }
  const wordsInGroup = await getWordsInGroups(groupDBData.id);
  const topPosition = _.max([-1, ...wordsInGroup.map(wordInGroup => wordInGroup.position)]) + 1 ?? 0;
  const wordsFromDB = await Promise.all(
    words.map(async word => {
      const wordDBData = await queryWord(word.word);
      const isWordExists = !!wordDBData;
      if (!isWordExists) {
        throw new Error(`word does not exists - ${word.word}`);
      } else {
        return { ...wordDBData, position: topPosition + word.position };
      }
    })
  );

  await Promise.all(
    wordsFromDB.map(async word => {
      await execute(
        `INSERT INTO \`groupsToWords\` (id,groupId,wordId,position) VALUES ('${uuid()}','${groupDBData.id}','${
          word.id
        }', ${word.position})`
      );
    })
  );
};
