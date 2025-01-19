// api.js
import axios from 'axios';
import { environment } from './environments/environments';

const actualizarDato = async (id, newData) => {
  try {

    const body = {
        "json_serialized": newData
      };
    const response = await axios.patch(environment.endpoint+`/api/v1/odontograma/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default actualizarDato;
