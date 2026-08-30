const API_URL = "http://localhost:8000/api";

export const API = {
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  me: `${API_URL}/auth/me`,
  users: `${API_URL}/users`,
  products: `${API_URL}/products`,
  cart: `${API_URL}/cart`,
  orders: `${API_URL}/orders`,
  payments: `${API_URL}/payments`,
  estimations: `${API_URL}/estimations`,
};

export default API;