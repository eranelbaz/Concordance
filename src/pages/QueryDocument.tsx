import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const AddDocument: React.FC = () => {
  const { register, getValues } = useForm();
  const [result, setResult] = useState<[{ author: string; album: string; title: string; year: string; id: string }]>(
    []
  );
  const onSubmit = async () => {
    const formData = _.omitBy(getValues(), _.isNil);

    const { data } = await post('/search', formData);

    // @ts-ignore
    setResult(Object.keys(data).map(key => ({ ...data[key], id: key })));
  };
  console.log(result);
  return (
    <PageContainer content={'Query Document'}>
      <Card>
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
          <Form.Item label={'content'}>
            <textarea {...register('content')} rows={10} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => onSubmit()}>
              Search
            </Button>
          </Form.Item>
        </Form>
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
