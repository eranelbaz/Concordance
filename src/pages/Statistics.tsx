import { post } from '@/services/client';
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<{ title: string; value: string }[]>([]);
  useAsyncEffect(async () => {
    const response = await post('/getStats', {});
    setStats(response.data);
  });
  return (
    <PageContainer content={'Statistics'}>
      <Card>
        <table>
          <tr>
            <th>Title</th>
            <th>Value</th>
          </tr>
          {stats.map(({ title, value }) => {
            return (
              <tr>
                <td>{title}</td>
                <td>{value}</td>
              </tr>
            );
          })}
        </table>
      </Card>
    </PageContainer>
  );
};

export default Stats;
