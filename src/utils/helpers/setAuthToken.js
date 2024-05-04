// apiService.js

import axios from "axios";


const api = axios.create({
  baseURL: "hhttps://www.socialnetwork.somee.com/api/auth/login",
});

// Hàm này sẽ thêm token vào header nếu token tồn tại
const setAuthToken = (token) => {
  console.log(`Bearer s ${token}`);
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
const authAxios = axios.create({
    baseURL: 'hhttps://www.socialnetwork.somee.com/api',
  });

  const publicAxios = axios.create({
    baseURL: 'https://www.socialnetwork.somee.com/api',
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
