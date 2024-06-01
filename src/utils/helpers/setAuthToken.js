// apiService.js

import axios from "axios";


const api = axios.create({
  baseURL: "https://truongnetwwork.bsite.net/api/auth/login",
});

// Hàm này sẽ thêm token vào header nếu token tồn tại
const setAuthToken = (token) => {

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
const authAxios = axios.create({
    baseURL: 'https://truongnetwwork.bsite.net/api',
  });

  const publicAxios = axios.create({
    baseURL: 'https://truongnetwwork.bsite.net/api',
  });

  authAxios.interceptors.request.use(
    config => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authContext.getAccessToken()}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
export { api, setAuthToken };
