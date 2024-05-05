// api.js
import axios from 'axios';

const actualizarDato = async (id, newData) => {
  try {

    const body = {
        "json_serialized": newData
      };
    const response = await axios.patch(`http://localhost:3000/api/v1/odontograma/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default actualizarDato;
