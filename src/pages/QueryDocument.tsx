import { DocumentLineContext } from '@/components/WordIndexes';
import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { WordToDocument } from '../be/db/models';
type FixedMetadata = { author: string; album: string; title: string; year: string; id: string };

const QueryDocument: React.FC = () => {
  const { register, getValues } = useForm();
  const [metadataSearchResults, setMetadataSearchResults] = useState<Record<string, FixedMetadata>>({});
  const [wordsResults, setWordsResults] = useState<Record<string, WordToDocument[]>>({});
  const [showIndex, setShowIndex] = useState(false);
  const [wordsMetadataResults, setWordsMetadataResults] = useState<Record<string, FixedMetadata>>({});

  const onMetadataSubmit = async () => {
    const formData = _.omitBy(getValues(), _.isNil);

    const { data } = await post('/searchMetadata', formData);

    // @ts-ignore
    setMetadataSearchResults(Object.keys(data).map(key => ({ ...data[key], id: key })));
  };
  const onContentSubmit = async () => {
    const content = _.omitBy(getValues(), _.isNil)['content'].split(' ');
    const { data } = await post('/searchContent', content);

    // @ts-ignore
    setMetadataSearchResults(Object.keys(data).map(key => ({ ...data[key], id: key })));
  };

  const onWordsSearch = async queryAll => {
    const idsToQuery = Array.from(document.querySelectorAll('.queryThisDocument'))
      .filter(element => element.checked)
      .map(element => element.getAttribute('data-id'));

    const { data: words } = await post('/getDocumentWords', { documentIds: queryAll ? [] : idsToQuery });
    const { data: metadata } = await post('/getDocumentsMetadata', { documentIds: queryAll ? [] : idsToQuery });

    setWordsResults(words);
    setWordsMetadataResults(metadata);
  };
  console.log(wordsMetadataResults);

  return (
    <PageContainer content={'Query Document'}>
      <Card>
        <h1>By Metadata</h1>
        <Form
          labelAlign={'left'}
          name="basic"
          labelCol={{
            span: 2
          }}
          wrapperCol={{
            span: 3
          }}
          autoComplete="off">
          <Form.Item label={'author'}>
            <input {...register('author')} />
          </Form.Item>
          <Form.Item label={'title'}>
            <input {...register('title')} />
          </Form.Item>
          <Form.Item label={'album'}>
            <input {...register('album')} />
          </Form.Item>
          <Form.Item label={'year'}>
            <input type={'number'} {...register('year')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => onMetadataSubmit()}>
              Search
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <h1>By words</h1>
        <Form
          labelAlign={'left'}
          name="basic"
          labelCol={{
            span: 2
          }}
          wrapperCol={{
            span: 3
          }}
          autoComplete="off">
          <Form.Item label={'content'}>
            <input {...register('content')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => onContentSubmit()}>
              Search
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        {Object.keys(metadataSearchResults).length > 0 && (
          <table>
            <tr>
              <th>Query Words</th>
              <th>Author</th>
              <th>Album</th>
              <th>Title</th>
              <th>Year</th>
            </tr>
            {Object.keys(metadataSearchResults).map(documentId => {
              const documentData = metadataSearchResults[documentId];
              return (
                <tr>
                  <td>
                    <input type={'checkbox'} data-id={documentData.id} className={'queryThisDocument'} />
                  </td>
                  <td>{documentData.author}</td>
                  <td>{documentData.album}</td>
                  <td>{documentData.title}</td>
                  <td>{documentData.year}</td>
                </tr>
              );
            })}
          </table>
        )}
        <button onClick={() => onWordsSearch(false)}>Search words for selected</button>
        <button onClick={() => onWordsSearch(true)}>Search words for all</button> <br />
        <label>
          <input type={'checkbox'} onChange={() => setShowIndex(!showIndex)} />
          Show index
        </label>
        {Object.keys(wordsResults).map(documentId => {
          const documentsWords = _.uniqBy(wordsResults[documentId], 'wordId');
          return (
            <>
              <h3>
                {wordsMetadataResults[documentId] != undefined && (
                  <>
                    The words for {wordsMetadataResults[documentId]?.author}, {wordsMetadataResults[documentId]?.album},
                    {wordsMetadataResults[documentId]?.title}, {wordsMetadataResults[documentId]?.year}
                  </>
                )}
              </h3>
              {documentsWords.map(word => {
                return (
                  <>
                    <a href={`words/${word.documentId}/${word.wordId}`}>{word.word} </a>
                    {showIndex && <DocumentLineContext documentWords={wordsResults[documentId]} wordId={word.wordId} />}
                    <br />
                  </>
                );
              })}
            </>
          );
        })}
      </Card>
    </PageContainer>
  );
};

export default QueryDocument;
