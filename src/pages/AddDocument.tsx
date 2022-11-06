import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form } from 'antd';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const AddDocument: React.FC = () => {
  const {
    register,
    getValues,
    formState: { isValid },
    trigger
  } = useForm();
  const [result, setResult] = useState('');

  const onSubmit = async () => {
    if (isValid) {
      const data = getValues();

      setResult('loading');

      const response = await post('/load', data);
      setResult(response.data);
    }
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
            <input onChange={() => trigger()} {...register('author', { required: true })} />
          </Form.Item>
          <Form.Item label={'title'}>
            <input onChange={() => trigger()} {...register('title', { required: true })} />
          </Form.Item>
          <Form.Item label={'album'}>
            <input onChange={() => trigger()} {...register('album', { required: true })} />
          </Form.Item>
          <Form.Item label={'year'}>
            <input onInput={() => trigger()} type={'number'} {...register('year', { required: true })} />
          </Form.Item>
          <Form.Item label={'content'}>
            <textarea
              onChange={() => trigger()}
              style={{ resize: 'both' }}
              {...register('content', { required: true })}
              rows={10}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => onSubmit()}>
              Submit
            </Button>
          </Form.Item>
          <label>{isValid ? result : 'form isnt valid'}</label>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default AddDocument;
