// api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchAgencies = async () => {
  try {
    const response = await axios.get(`${API_URL}/agencies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agencies:', error);
    throw error;
  }
};
