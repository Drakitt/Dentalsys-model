import axios from 'axios';

const fetchData = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/odontograma/${id}`);
    return response; 
  } catch (error) {
    throw new Error('Error fetching data'); 
  }
};

export default fetchData;
