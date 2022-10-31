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
  const [wordsMetadataResults, setWordsMetadataResults] = useState<Record<string, FixedMetadata>>({});

  const onMetadataSubmit = async () => {
    const formData = _.omitBy(getValues(), _.isNil);

    const { data } = await post('/searchMetadata', formData);

    // @ts-ignore
    setMetadataSearchResults(Object.keys(data).map(key => ({ ...data[key], id: key })));
  };
  const onContentSubmit = async () => {
    const content = _.omitBy(getValues(), _.isNil)['content'].split(' ');
    const {
      data: { words, metadata }
    } = await post('/searchContent', content);

    // @ts-ignore
    setMetadataSearchResults(Object.keys(words).map(key => ({ ...words[key], id: key })));
  };

  const onSearch = async queryAll => {
    let data;
    const idsToQuery = Array.from(document.querySelectorAll('.queryThisDocument'))
      .filter(element => element.checked)
      .map(element => element.getAttribute('data-id'));

    ({ data } = await post('/getDocumentContent', { documentIds: queryAll ? [] : idsToQuery }));

    setWordsResults(data);
    setWordsResults(data);
  };

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
        <button onClick={() => onSearch(false)}>Search words for selected</button>
        <button onClick={() => onSearch(true)}>Search words for all</button>
      </Card>

      {Object.keys(wordsResults).map(documentId => {
        const documentsWords = wordsResults[documentId];
        const sortedWords = {};
        documentsWords.forEach(word => {
          const line = (sortedWords[word.lineIndex] || []) as WordToDocument[];
          sortedWords[word.lineIndex] = [...line, word].sort((a, b) => a.wordIndex - b.wordIndex);
        });
        const linesWithWords = Object.values(sortedWords) as WordToDocument[][];
        return (
          <>
            <h3>The words for {}</h3>
            {linesWithWords.flatMap(line => {
              return (
                <>
                  <span>{line.flatMap(wordInLine => wordInLine.word).join(' ')}</span>
                  <br />
                </>
              );
            })}
          </>
        );
      })}
    </PageContainer>
  );
};

export default QueryDocument;
