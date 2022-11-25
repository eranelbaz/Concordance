import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAsyncEffect from 'use-async-effect';
import { Group, GroupToWords } from '../be/db/models';

const AddWordsToGroup: React.FC<{
  selectedGroupId: string;
  existingGroups: Group[];
  setForceFetch: (rand: number) => void;
}> = ({ selectedGroupId, existingGroups, setForceFetch }) => {
  const {
    register,
    getValues,
    setValue,
    formState: { isValid },
    trigger
  } = useForm();

  const [addGroupResponse, setAddGroupResponse] = useState<string>();
  useEffect(() => {
    const selectedGroupName = existingGroups.find(group => group.id === selectedGroupId)?.name;
    setValue('name', selectedGroupName);
  }, [selectedGroupId, existingGroups]);

  const onAddToGroupSubmit = async () => {
    if (isValid) {
      const { name, words } = getValues() as { name: string; words: string };

      const insertResponse = await post('/insertToGroupWords', {
        name,
        words: _(words)
          .split('\n')
          .map((word, position) => ({
            word: word.trim(),
            position
          }))
          .filter(word => word.word.length > 0)
          .value()
      });
      setAddGroupResponse(insertResponse.data);
      setForceFetch(Math.random());
    }
  };

  return (
    <>
      <h1>Add To group</h1>
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
          <Button disabled={!isValid} type="primary" onClick={() => onAddToGroupSubmit()}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      {addGroupResponse}
    </>
  );
};

const QueryGroup: React.FC<{ existingGroups: Group[]; setSelectedGroupId: (id: string) => void; forceFetch: number }> =
  ({ existingGroups, setSelectedGroupId, forceFetch }) => {
    const [wordsInGroup, setWordsInGroup] = useState<GroupToWords[]>([]);
    const [groupId, setGroupId] = useState<string>();
    const queryGroupWords = async (groupId: string) => {
      const response = await post('/getWordsInGroups', { groupId });
      setWordsInGroup(response.data);
      setSelectedGroupId(groupId);
    };

    useAsyncEffect(() => queryGroupWords(groupId), [existingGroups, groupId, forceFetch]);

    return (
      <>
        <h1>Edit existing group</h1>
        <label>Choose group name:</label>

        <select onChange={e => setGroupId(e.target.value)}>
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
      </>
    );
  };

const CreateGroup: React.FC<{ setExistingGroups: (groups: Group[]) => void }> = ({ setExistingGroups }) => {
  const {
    register,
    getValues,
    formState: { isValid },
    trigger
  } = useForm();
  const [createGroupResponse, setCreateGroupResponse] = useState<string>();
  const onCreateGroupSubmit = async () => {
    if (isValid) {
      await trigger();
      const { name, type } = getValues();
      const createGroupResponse = await post('/createWordGroups', { name, type });
      setCreateGroupResponse(createGroupResponse.data);
      const getWordsGroupResponse = await post('/getWordGroups', {});
      setExistingGroups(getWordsGroupResponse.data);
    }
  };

  return (
    <>
      <h1>Create group</h1>
      <Form.Item label={'name'}>
        <input onInput={() => trigger()} {...register('name', { required: true })} />
      </Form.Item>
      <Form.Item label={'type'}>
        <select onChange={() => trigger()} {...register('type')}>
          <option value={'regular'}>Regular</option>
          <option value={'phrase'}>Phrase</option>
        </select>
      </Form.Item>
      <Form.Item>
        <Button disabled={!isValid} type="primary" onClick={() => onCreateGroupSubmit()}>
          Submit
        </Button>
      </Form.Item>
      {createGroupResponse}
    </>
  );
};

const AddDocument: React.FC = () => {
  const [existingGroups, setExistingGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>();
  const [forceFetch, setForceFetch] = useState<number>();

  const loadInitialData = async () => {
    const response = await post('/getWordGroups', {});
    setExistingGroups(response.data);
  };
  useAsyncEffect(async () => loadInitialData(), []);

  return (
    <PageContainer content={'Add Document'}>
      <Card>
        <CreateGroup setExistingGroups={setExistingGroups} />
      </Card>
      <Card>
        <QueryGroup forceFetch={forceFetch} existingGroups={existingGroups} setSelectedGroupId={setSelectedGroupId} />
      </Card>
      <Card>
        <AddWordsToGroup
          setForceFetch={setForceFetch}
          existingGroups={existingGroups}
          selectedGroupId={selectedGroupId}
        />
      </Card>
    </PageContainer>
  );
};

export default AddDocument;
