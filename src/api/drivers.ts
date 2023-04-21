import apiClient from "./http/axios-client";

import { notification } from "../service/notification";

import { IDriver, IDriverCreate } from "../interface/Driver";

class DriverService {
  async get(id: number): Promise<IDriver | {}> {
    try {
      const response = await apiClient.get(`/drivers/${id}`);

      return response.data || {};
    } catch (error) {
      notification("error", `При получении водителя произошла ошибка: ${error}`);

      throw new Error(`При получении водителя произошла ошибка: ${error}`);
    }
  }

  async getDriverByPhone(phone: string): Promise<IDriver | {}> {
    try {
      const response = await apiClient.get(`/drivers/phone/`, {
        params: { phone },
      });

      return response.data || {};
    } catch (error) {
      notification("error", `При получении водителя произошла ошибка: ${error}`);

      throw new Error(`При получении водителя произошла ошибка: ${error}`);
    }
  }

  async create(data: IDriverCreate): Promise<IDriver | {}> {
    try {
      const response = await apiClient.post("/drivers", data);

      return response.data || {};
    } catch (error) {
      notification("error", `При создании водителя произошла ошибка: ${error}`);

      throw new Error(`При создании водителя произошла ошибка: ${error}`);
    }
  }

  async update(id: number, data: IDriver): Promise<IDriver | {}> {
    try {
      const response = await apiClient.put(`/drivers/${id}`, data);

      return response.data || {};
    } catch (error) {
      notification("error", `При обновлении водителя произошла ошибка: ${error}`);

      throw new Error(`При обновлении водителя произошла ошибка: ${error}`);
    }
  }

  async delete(id: number): Promise<IDriver | {}> {
    try {
      const response = await apiClient.delete(`/drivers/${id}`);

      return response.data || {};
    } catch (error) {
      notification("error", `При удалении водителя произошла ошибка: ${error}`);

      throw new Error(`При удалении водителя произошла ошибка: ${error}`);
    }
  }

  async findByTitle(title: string): Promise<IDriver[] | []> {
    try {
      const response = await apiClient.get(`/drivers?title=${title}`);

      return response.data || [];
    } catch (error) {
      notification("error", `При поиске водителей произошла ошибка: ${error}`);

      throw new Error(`При поиске водителей произошла ошибка: ${error}`);
    }
  }
}

export default new DriverService();
