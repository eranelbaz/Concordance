import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { WordToDocument } from '../be/db/models';

type FixedMetadata = { author: string; album: string; title: string; year: string; id: string };
const DocumentContent: React.FC = () => {
  const [documentMetadata, setDocumentMetadata] = useState<FixedMetadata>();
  const [documentContent, setDocumentContent] = useState<WordToDocument[]>();

  const documentId = document.URL.split('/').reverse()[0];
  useAsyncEffect(async () => {
    const { data: documentMetadata } = await post('/getDocumentMetadata', { documentId });
    const { data: documentContent } = await post('/getDocumentContent', { documentId });

    setDocumentMetadata(documentMetadata);
    setDocumentContent(documentContent);
  }, [documentId]);

  const documentContentByLines = _(documentContent).groupBy('lineIndex').value();
  return documentMetadata ? (
    <PageContainer content={'Query Document'}>
      <Card>
        <h1>
          Content of document {documentMetadata[documentId]?.author}, {documentMetadata[documentId]?.album},
          {documentMetadata[documentId]?.title},{documentMetadata[documentId]?.year}
        </h1>

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
