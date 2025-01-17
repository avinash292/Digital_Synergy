import axios from "axios";
import { BASE_API_PATH } from "../config";
import authService from "../services/authService";

const API = axios.create({
  baseURL: BASE_API_PATH,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use(
  (config) => {
    /* if (config.url !== 'login' && config.url !== 'refresh_token') {
		authService.checkToken();
	} */
    if (localStorage.getItem("access_token")) {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "access_token"
      )}`;
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    if (
      response.data.success &&
      response.data.token !== undefined &&
      response.data.token !== ""
    ) {
      localStorage.setItem("access_token", response.data.token);
      if (response.config.url !== "refresh_token") {
        localStorage.setItem(
          "user_data",
          JSON.stringify(response.data.data.userData)
        );
      }
    }
    if (
      response.data.success === false &&
      response.data.status !== undefined &&
      response.data.status === "logged-out"
    ) {
      authService.logout();
    }
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.log("API call error :", error.response);
    if (
      error.response &&
      error.response.data.success === false &&
      error.response.data.status !== undefined &&
      error.response.data.status === "logged-out"
    ) {
      authService.logout();
    }
    return Promise.reject(error);
  }
);

export default API;
