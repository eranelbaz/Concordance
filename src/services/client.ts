import axios from 'axios';
const URL = 'http://localhost:3001';
export const post = (path: string, data, config = undefined) => {
  try {
    return axios.post(URL.concat(path), data, config);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
