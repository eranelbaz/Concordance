import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form } from 'antd';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAsyncEffect from 'use-async-effect';
import { Group } from '../be/db/models';

const AddDocument: React.FC = () => {
  const {
    register,
    getValues,
    formState: { isValid },
    trigger
  } = useForm();
  const [existingGroups, setExistingGroups] = useState<Group[]>([]);
  const [addGroupResponse, setAddGroupResponse] = useState<string>();
  const loadGroups = async () => {
    const response = await post('/getWordGroups', {});
    setExistingGroups(response.data);
  };
  useAsyncEffect(async () => loadGroups(), []);
  const { name, words } = getValues();
  const onSubmit = async () => {
    if (isValid) {
      const response = await post('/createWordGroups', { name, words: words.split('\n') });
      setAddGroupResponse(response.data);
      await loadGroups();
    }
  };
  return (
    <PageContainer content={'Add Document'}>
      <Card>
        <h1>Edit existing group</h1>
        <label>Choose group name:</label>

        <select>
          {existingGroups.map(group => (
            <option value={group.id}>{group.name}</option>
          ))}
        </select>
      </Card>
      <Card>
        <h1>Add group</h1>
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
          <Form.Item label={'name'}>
            <input onInput={() => console.log(getValues())} {...register('name', { required: true })} />
          </Form.Item>
          <Form.Item label={'words'}>
            <textarea
              placeholder={'split by line'}
              onInput={() => trigger()}
              style={{ resize: 'both' }}
              {...register('words', { required: true })}
              rows={10}
            />
          </Form.Item>
          <Form.Item>
            <Button disabled={!isValid} type="primary" onClick={() => onSubmit()}>
              Submit
            </Button>
          </Form.Item>
        </Form>
        {addGroupResponse}
      </Card>
    </PageContainer>
  );
};

export default AddDocument;
