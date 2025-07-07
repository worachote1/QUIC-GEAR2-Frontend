
import axios from 'axios';


/**
    This file creates a customized axios instance with built-in logic to:
        - Automatically attach access tokens to requests
        - Detect if a token is expired
        - Automatically refresh the token and retry the failed request
        - Redirect to login if the refresh fails
 */


// Setup Custom Axios Instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QUIC_GEAR2_API, // use .env
  withCredentials: true, // send cookie refreshToken
});

// // Request Interceptor → Add Access Token (Before Sending a Request)
// api.interceptors.request.use((config) => {
//   const token = getAccessToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   console.log("check config : ")
//   console.log(config)
//   return config;
// });

// // Response Interceptor → Handle Expired Token
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;
//     console.log("check err: ")
//     console.log(error)
//     // If token expired and not already retried
//     if (error.response?.status === 401 && !originalRequest._retry) {

//       try {
//         console.log("try to get refresh token: ")
//         const res = await axios.post(
//           `${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/auth/refresh-token`,
//           {},
//           { withCredentials: true }
//         );

//         const newAccessToken = res.data.accessToken;
//         setAccessToken(newAccessToken);

//         // Retry original request with new access token
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         originalRequest._retry = true;

//         return api(originalRequest);

//       } catch (err) {

//         setAccessToken(null);

//         // Refresh token failed — force logout
//         console.error('Refresh failed. Redirecting to login.', err);

//         console.log("check localtion path: ", window.location.pathname)
//         console.log("check location search: ", window.location.search)

//         // Save last path before redirect (in sign-inpage after login sucess it will redirect to that path)
//         if (typeof window !== 'undefined') {
//             const currentPath = window.location.pathname + window.location.search;
//             localStorage.setItem('redirectAfterLogin', currentPath); // save to localStorage
//             window.location.href = '/auth/sign-in';
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
