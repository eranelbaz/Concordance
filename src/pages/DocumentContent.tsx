import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import _ from 'lodash';
import React, { useMemo, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Group, GroupToWords, WordToDocument } from '../be/db/models';

type FixedMetadata = { author: string; album: string; title: string; year: string; id: string };
const DocumentContent: React.FC = () => {
  const [documentMetadata, setDocumentMetadata] = useState<FixedMetadata>();
  const [documentContent, setDocumentContent] = useState<WordToDocument[]>();
  const [existingGroups, setExistingGroups] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState<string>();
  const [documentWordsInGroupById, setDocumentWordsInGroupById] = useState<string[]>([]);
  const [wordsInGroup, setWordsInGroup] = useState<GroupToWords[]>([]);
  const documentContentByLines = useMemo(() => _(documentContent).groupBy('lineIndex').value(), [documentContent]);

  const documentId = document.URL.split('/').reverse()[0];
  useAsyncEffect(async () => {
    const response = await post('/getWordGroups', {});
    setExistingGroups((response.data as Group[]).filter(group => group.type === 'phrase'));
  }, []);

  const onPhraseSearch = async () => {
    const response = await post('/getWordsInGroups', { groupId });
    const wordsInGroup = response.data as GroupToWords[];
    setWordsInGroup(wordsInGroup);
    const wordsInDocument = Object.keys(documentContentByLines).flatMap(lineNumber =>
      documentContentByLines[lineNumber]?.map(word => word)
    );
    const chunkSize = wordsInGroup.length;
    const wordsInDocumentChunks: WordToDocument[][] = [];
    for (let i = 0; i < wordsInDocument.length; i += 1) {
      const chunk = wordsInDocument.slice(i, i + chunkSize);
      wordsInDocumentChunks.push(chunk);
    }
    const equals = _.flatten(
      wordsInDocumentChunks.filter(chunk => {
        return _.isEqual(
          chunk.map(a => a.wordId),
          wordsInGroup.map(b => b.wordId)
        );
      })
    );
    setDocumentWordsInGroupById(equals.map(({ id }) => id));
  };

  useAsyncEffect(async () => {
    const { data: documentMetadata } = await post('/getDocumentMetadata', { documentId });
    const { data: documentContent } = await post('/getDocumentContent', { documentId });

    setDocumentMetadata(documentMetadata);
    setDocumentContent(documentContent);
  }, [documentId]);

  return documentMetadata ? (
    <PageContainer content={'Query Document'}>
      <Card>
        <h1>
          Content of document {documentMetadata[documentId]?.author}, {documentMetadata[documentId]?.album},
          {documentMetadata[documentId]?.title},{documentMetadata[documentId]?.year}
        </h1>
        <br />
        <h2>phrase groups</h2>
        <select onChange={e => setGroupId(e.target.value)}>
          <option value={undefined}></option>
          {existingGroups.map(group => (
            <option value={group.id}>{group.name}</option>
          ))}
        </select>
        <h2>Words in this group</h2>
        {wordsInGroup.map(word => {
          return (
            <>
              <label>{word.word} </label>
              <br />
            </>
          );
        })}
        <button onClick={onPhraseSearch}>search</button>
        <br />
        <h2>Content</h2>
        {Object.keys(documentContentByLines).map(lineNumber => (
          <>
            {documentContentByLines[lineNumber]?.map(word => {
              if (documentWordsInGroupById.includes(word.id)) return <b>{word.word} </b>;
              else return <label>{word.word} </label>;
            })}
            <br />
          </>
        ))}
      </Card>
    </PageContainer>
  ) : (
    <></>
  );
};

export default DocumentContent;
