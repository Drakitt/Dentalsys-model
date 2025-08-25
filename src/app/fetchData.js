import axios from 'axios';

const fetchData = async (id) => {
  try {
  //   const response = await axios.get({
  //   method: 'get',
  //   url: `https://dentalsys-services.onrender.com/api/v1/odontograma/${id}`,
  //   withCredentials: false
  // }
  //     );
    const response = await axios.get(`https://dentalsys-services.onrender.com/api/v1/odontograma/${id}`);
    return response; 
  } catch (error) {
    throw new Error('Error fetching data'); 
  }
};

export default fetchData;
