// import { saveWordsOfDocument } from '@/be/db/stores/words';
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';
import { useForm } from 'react-hook-form';

const AddDocument: React.FC = () => {
  const { register, trigger, handleSubmit } = useForm();
  const onSubmit = async (data, e) => {};
  const onError = (errors, e) => console.log(errors, e);
  return (
    <PageContainer content={'Add Document'}>
      <Card>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <input {...register('author', { required: true })} />
          <input {...register('title', { required: true })} />
          <input {...register('album', { required: true })} />
          <input type={'number'} {...register('year', { required: true })} />
          <input {...register('content', { required: true })} />
          <button
            type="button"
            onClick={async () => {
              const result = await trigger('author');
              console.log(result);
              // const result = await trigger("lastName", { shouldFocus: true }); allowed to focus input
            }}>
            Trigger
          </button>
          <button
            type="button"
            onClick={async () => {
              const result = await trigger(['title', 'album']);
              console.log(result);
            }}>
            Trigger Multiple
          </button>
          <button
            type="button"
            onClick={() => {
              trigger();
            }}>
            Trigger All
          </button>
          <button type="submit">Submit</button>
        </form>
      </Card>
    </PageContainer>
  );
};

export default AddDocument;
