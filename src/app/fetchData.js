import axios from 'axios';

const fetchData = async (id) => {
  try {
      axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    const response = await axios.get({
    method: 'get',
    url: `https://dentalsys-services.onrender.com/api/v1/odontograma/${id}`,
    withCredentials: false
  }
      );
    return response; 
  } catch (error) {
    throw new Error('Error fetching data'); 
  }
};

export default fetchData;
