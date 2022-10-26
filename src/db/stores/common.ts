import { Connection, createConnection } from 'mysql2/promise';
const DB_CONNECTION_DETAILS = {
  DB_HOST: 'localhost',
  DB_USER: 'root',
  DB_PASSWORD: 'root',
  DB_PORT: '3306',
  DB_DATABASE: 'concordance'
};

let connection: Connection;

export const init = async () => {
  if (connection) return;
  try {
    connection = await createConnection({
      host: DB_CONNECTION_DETAILS.DB_HOST,
      user: DB_CONNECTION_DETAILS.DB_USER,
      password: DB_CONNECTION_DETAILS.DB_PASSWORD,
      database: DB_CONNECTION_DETAILS.DB_DATABASE
    });
    await execute('SELECT 1');

    console.debug('MySql Adapter Pool generated successfully');
  } catch (error) {
    console.error('[mysql.connector][init][Error]: ', error);
    throw new Error('failed to initialized pool');
  }
};

export const execute = async (query: string, params: string[] | Object = []) => {
  console.log(`executing ${query}`);
  try {
    if (!connection) await init();
    return await connection.execute(query, params);
  } catch (error) {
    console.error('[mysql.connector][execute][Error]: ', error);
    throw new Error('failed to execute MySQL query');
  }
};
