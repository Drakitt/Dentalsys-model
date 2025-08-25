import axios from 'axios';
import { environment } from './environments/environments';

const create = async (newData) => {
  try {
    const response = await axios.post(environment.endpoint+`/api/v1/tratamientos/forOdonto`,newData,{
    method: 'get',
    withCredentials: false
  });
    return response.data.data.rows;
  } catch (error) {
    throw error;
  }
};

export default create;
