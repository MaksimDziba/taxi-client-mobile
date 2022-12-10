import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  responseType: "json",
  responseEncoding: "utf8",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
    post: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    delete: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    put: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  },
});

export default apiClient;
