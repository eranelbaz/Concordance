import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form } from 'antd';
import React from 'react';
import { useForm } from 'react-hook-form';

const AddDocument: React.FC = () => {
  const { register, getValues } = useForm();
  const onSubmit = async () => {
    const data = getValues();
    console.log(data);
    await post('/load', data);
  };
  return (
    <PageContainer content={'Add Document'}>
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
            <input {...register('author', { required: true })} />
          </Form.Item>
          <Form.Item label={'title'}>
            <input {...register('title', { required: true })} />
          </Form.Item>
          <Form.Item label={'album'}>
            <input {...register('album', { required: true })} />
          </Form.Item>
          <Form.Item label={'year'}>
            <input type={'number'} {...register('year', { required: true })} />
          </Form.Item>
          <Form.Item label={'content'}>
            <textarea {...register('content', { required: true })} rows={10} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => onSubmit()}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default AddDocument;
