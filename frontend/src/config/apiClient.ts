import axios from "axios";

const options = {
  baseUrl: import.meta.env.VITE_API_URL,
  withCredentials: true, 
};

// API client: a centralized object that handles the
// communication with our backend API. Instead of calling
// fetch/axios directly all over your app, you create an
// API client to: set a base url, include headers auto-
// matically and make your code cleaner and easier to
// maintain.

const API = axios.create(options);

// Interceptors are functions that run automatically before
// or after a request. One interceptor will run when the
// Promise resolves, and another when the response throws
// an Error, when the Promise is rejected.

API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const {status, data} = error.response;
    return Promise.reject({ status, ...data });
  }
);

export default API;