import axios from 'axios';

const fetchData = async (id) => {
  try {
    const response = await axios.get(`https://dentalsys-services.onrender.com/api/v1/odontograma/${id}`,{headers: {
                'Access-Control-Allow-Origin': '*',
                'origin':'x-requested-with',
                'Access-Control-Allow-Headers': 'POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin',
                'Content-Type': 'application/json',
            }});
    return response; 
  } catch (error) {
    throw new Error('Error fetching data'); 
  }
};

export default fetchData;
