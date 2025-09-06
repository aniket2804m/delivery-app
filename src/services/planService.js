import axios from 'axios';

const API_URL = 'http://localhost:5000/api/plans';

const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const createPlan = async (planData) => {
  const response = await axios.post(API_URL, planData, getConfig());
  return response.data;
};

const getMyDayPlan = async () => {
  const response = await axios.get(`${API_URL}/my-day`, getConfig());
  return response.data;
};

const updatePlanStatus = async (planId, status) => {
  const response = await axios.put(`${API_URL}/${planId}/status`, { status }, getConfig());
  return response.data;
};

// For Distributors/Admins to get all plans
const getAllPlans = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

const planService = {
  createPlan,
  getMyDayPlan,
  updatePlanStatus,
  getAllPlans,
};

export default planService;