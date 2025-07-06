
import axios from 'axios';
import { getAccessToken, setAccessToken } from './authToken';


// customized Axios instance (auth headers, retry logic)


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QUIC_GEAR2_API, // use .env
  withCredentials: true, // send cookie refreshToken
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Refresh failed. Redirecting to login.', err);
        // window.location.href = '/login'; /auth/sign-in
        window.location.href = '/auth/sign-in';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
