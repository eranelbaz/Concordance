import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { Group, WordToDocument } from '../be/db/models';

type FixedMetadata = { author: string; album: string; title: string; year: string; id: string };
const DocumentContent: React.FC = () => {
  const [documentMetadata, setDocumentMetadata] = useState<FixedMetadata>();
  const [documentContent, setDocumentContent] = useState<WordToDocument[]>();
  const [existingGroups, setExistingGroups] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState<string>();

  const documentId = document.URL.split('/').reverse()[0];
  useAsyncEffect(async () => {
    const response = await post('/getWordGroups', {});
    setExistingGroups((response.data as Group[]).filter(group => group.type === 'phrase'));
  }, []);

  useAsyncEffect(async () => {
    const { data: documentMetadata } = await post('/getDocumentMetadata', { documentId });
    const { data: documentContent } = await post('/getDocumentContent', { documentId });

    setDocumentMetadata(documentMetadata);
    setDocumentContent(documentContent);
  }, [documentId]);

  useCallback(async () => {
    await post('/isGroupInDocument', { groupId, documentId });
  }, [groupId, documentId]);

  const documentContentByLines = useMemo(() => _(documentContent).groupBy('lineIndex').value(), [documentContent]);
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

        <button>search</button>
        <br />
        <h2>Content</h2>
        {Object.keys(documentContentByLines).map(lineNumber => (
          <>
            {documentContentByLines[lineNumber]?.map(word => word.word).join(' ')}
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
