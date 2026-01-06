import axios from "axios";

// Use import.meta.env for Vite
const BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || `http://localhost:5000/api/v1`;
// (Default to port 5000 where the server runs locally or use VITE_BACKEND_URL)


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  }
});

// If we have a stored token (from previous login), set Authorization header so requests work even when cookies are blocked in dev
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

// Response interceptor: handle 401s globally
import toast from 'react-hot-toast';
let unauthorizedToastShown = false;
axiosInstance.interceptors.response.use(
  (response) => {
    // on any successful response, allow future 401 notifications again
    unauthorizedToastShown = false;
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // only show the notification once until a successful request occurs
      if (!unauthorizedToastShown) {
        unauthorizedToastShown = true;
        // remove saved token + login state so future requests don't keep failing and UI updates
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('role');
          localStorage.removeItem('data');
        }
        toast.error(error?.response?.data?.message || 'Session expired, please login again');
        // Optionally, redirect to login
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
