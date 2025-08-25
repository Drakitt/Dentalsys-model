import axios from 'axios';
import { environment } from './environments/environments';

const create = async (newData) => {
  try {
    const response = await axios.post(environment.endpoint+`/api/v1/tratamientos/forOdonto`,newData,{headers: {
                'Access-Control-Allow-Origin': '*',
                'origin':'x-requested-with',
                'Access-Control-Allow-Headers': 'POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin',
                'Content-Type': 'application/json',
            }});
    return response.data.data.rows;
  } catch (error) {
    throw error;
  }
};

export default create;
