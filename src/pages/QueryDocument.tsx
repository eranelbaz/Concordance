import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const AddDocument: React.FC = () => {
  const { register, getValues } = useForm();
  const [result, setResult] = useState<{ author: string; album: string; title: string; year: string; id: string }[]>(
    []
  );
  const onMetadataSubmit = async () => {
    const formData = _.omitBy(getValues(), _.isNil);

    const { data } = await post('/searchMetadata', formData);

    // @ts-ignore
    setResult(Object.keys(data).map(key => ({ ...data[key], id: key })));
  };
  const onContentSubmit = async () => {
    const content = _.omitBy(getValues(), _.isNil)['content'].split(' ');
    const { data } = await post('/searchContent', content);

    // @ts-ignore
    setResult(Object.keys(data).map(key => ({ ...data[key], id: key })));
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
        {Object.keys(result).length > 0 && (
          <table>
            <tr>
              <th>Author</th>
              <th>Album</th>
              <th>Title</th>
              <th>Year</th>
            </tr>
            {Object.keys(result).map(documentId => {
              const documentData = result[documentId];
              return (
                <tr>
                  <td>{documentData.author}</td>
                  <td>{documentData.album}</td>
                  <td>{documentData.title}</td>
                  <td>{documentData.year}</td>
                </tr>
              );
            })}
          </table>
        )}
      </Card>
    </PageContainer>
  );
};

export default AddDocument;
