import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form } from 'antd';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAsyncEffect from 'use-async-effect';
import { Group, GroupToWords } from '../be/db/models';

const AddDocument: React.FC = () => {
  const {
    register,
    getValues,
    setValue,
    formState: { isValid },
    trigger
  } = useForm();
  const [existingGroups, setExistingGroups] = useState<Group[]>([]);
  const [addGroupResponse, setAddGroupResponse] = useState<string>();
  const [wordsInGroup, setWordsInGroup] = useState<GroupToWords[]>([]);
  const loadInitialData = async () => {
    const response = await post('/getWordGroups', {});
    setExistingGroups(response.data);
  };
  useAsyncEffect(async () => loadInitialData(), []);
  const { name, words } = getValues();
  const onSubmit = async () => {
    if (isValid) {
      const response = await post('/createWordGroups', { name, words: words.split('\n') });
      setAddGroupResponse(response.data);
      await loadInitialData();
    }
  };

  const queryGroupWords = async (groupId: string) => {
    const response = await post('/getWordsInGroups', { groupId });
    setWordsInGroup(response.data);
    setValue('name', existingGroups.find(group => group.id === groupId).name);
  };

  return (
    <PageContainer content={'Add Document'}>
      <Card>
        <h1>Edit existing group</h1>
        <label>Choose group name:</label>

        <select onChange={e => queryGroupWords(e.target.value)}>
          <option value={undefined}></option>
          {existingGroups.map(group => (
            <option value={group.id}>{group.name}</option>
          ))}
        </select>
        <h2>Words in this group</h2>
        {wordsInGroup.map(word => {
          return (
            <>
              <label>{word.word} </label>
              <br />
            </>
          );
        })}
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
            <input onInput={() => trigger()} {...register('name', { required: true })} />
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
