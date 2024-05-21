import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "./context/ContextProvider.jsx";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    const navigate = useNavigate();
    const { setNotification } = useStateContext();

    if (response.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN');
      setNotification("Session expired. Please log in again.");
      navigate("/login");
    } else if (response.status === 404) {
      setNotification("Requested resource not found.");
      navigate("/not-found");
    } else {
      setNotification("An error occurred. Please try again.");
    }

    throw error;
  }
);

export default axiosClient;
