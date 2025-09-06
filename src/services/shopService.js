import axios from 'axios';

const API_URL = 'http://localhost:5000/api/shops';

const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const getAllShops = async () => {
  const response = await axios.get(API_URL, getConfig()); // Added auth config
  return response.data;
};

const createShop = async (shopData) => {
  const response = await axios.post(API_URL, shopData, getConfig()); // Added auth config
  return response.data;
};

const updateShop = async (id, shopData) => {
  const response = await axios.put(`${API_URL}/${id}`, shopData, getConfig()); // Added auth config
  return response.data;
};

// New method to update visit-specific details for a shop
const updateShopVisitDetails = async (id, visitData) => {
  const response = await axios.put(`${API_URL}/${id}/visit`, visitData, getConfig());
  return response.data;
};

const deleteShop = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getConfig()); // Added auth config
  return response.data;
};

const shopService = {
  getAllShops,
  createShop,
  updateShop,
  updateShopVisitDetails, // Export the new method
  deleteShop,
};

export default shopService;