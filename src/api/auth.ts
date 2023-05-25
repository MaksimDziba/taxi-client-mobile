import apiClient from './http/axios-client';

import { notification } from '../service/notification';

import { AxiosError } from 'axios';

type UserData = {
  password: string;
  phone: string;
  role: 'client' | 'driver';
}

const loginUser = async (params: UserData) => {
  try {
    const { data } = await apiClient.post('/auth/login', params);

    if (data.token && data.user) {
      const token = `Bearer ${data.token}`;

      apiClient.defaults.headers.common['Authorization'] = token;

      return data || null;
    }
  } catch (error) {
    // TODO: перенести проверку в notification или создать отдельный сервис serviceError
    let message = 'При получении токена произошла ошибка';

    if (error instanceof AxiosError) {
      message += `: ${error.response?.data?.message}`;
    }

    notification('error', message);

    throw new Error(message);
  }
};

const registrationUser = async (params: UserData) => {
  try {
    const { data } = await apiClient.post('/auth/registration', params);

    if (data) {
      const token = `Bearer ${data.Authenticate}`;

      apiClient.defaults.headers.common['Authorization'] = token;

      return data || null;
    }
  } catch (error) {
    notification('error', `При регистрации произошла ошибка: ${error}`);

    throw new Error(`При регистрации произошла ошибка. ${error}`);
  }
};

const logoutUser = async () => {
  try {
    apiClient.defaults.headers.common['Authorization'] = '';
  } catch (error) {
    notification(
      'error',
      `При выходе из приложения произошла ошибка: ${error}`,
    );

    throw new Error(`При выходе из приложения произошла ошибка. ${error}`);
  }
};

export { loginUser, registrationUser, logoutUser };
