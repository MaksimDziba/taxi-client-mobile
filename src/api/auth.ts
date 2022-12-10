import apiClient from "./http/axios-client";

import { notification } from "../service/notification";

import { IUser } from "../interface/User";


const loginUser = async (params: IUser) => {
  try {
    const { data } = await apiClient.post("/auth/login", params);

    if (data.token && data.user) {
      const token = `Bearer ${data.token}`;

      apiClient.defaults.headers.common["Authorization"] = token;

      return data || null;
    }
  } catch (error) {
    notification("error", `При получении токена произошла ошибка: ${error}`);

    throw new Error(`При получении токена произошла ошибка. ${error}`);
  }
};

const registrationUser = async (params: IUser) => {
  try {
    const { data } = await apiClient.post("/auth/registration", params);

    if (data) {
      const token = `Bearer ${data.Authenticate}`;

      apiClient.defaults.headers.common["Authorization"] = token;

      return data || null;
    }
  } catch (error) {
    notification("error", `При регистрации произошла ошибка: ${error}`);

    throw new Error(`При получении токена произошла ошибка. ${error}`);
  }
};

export { loginUser, registrationUser };
