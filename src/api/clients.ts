import apiClient from "./http/axios-client";

import { notification } from "../service/notification";

import { IClient } from "../interface/Client";

class ClientService {
  async getAll(params: object): Promise<IClient[] | []> {
    try {
      const response = await apiClient.get("/clients", {
        params,
      });

      return response.data || [];
    } catch (error) {
      notification("error", `При получении клиентов произошла ошибка: ${error}`);

      throw new Error(`При получении клиентов произошла ошибка: ${error}`);
    }
  }

  async get(id: number): Promise<IClient | {}> {
    try {
      const response = await apiClient.get(`/clients/${id}`);

    return response.data || {};
    } catch (error) {
      notification("error", `При получении клиента произошла ошибка: ${error}`);

      throw new Error(`При получении клиента произошла ошибка: ${error}`);
    }
    
  }

  async getClientByPhone(phone: string): Promise<IClient | {}> {
    try {
      const response = await apiClient.get(`/clients/phone`, {
        params: { phone },
      });

      return response.data || {};
    } catch (error) {
      notification("error", `При получении клиента произошла ошибка: ${error}`);

      throw new Error(`При получении клиента произошла ошибка: ${error}`);
    }
  }

  async create(data: IClient): Promise<IClient> {
    try {
      const response = await apiClient.post("/clients", data);

      return response.data;
    } catch (error) {
      notification("error", `При создании клиента произошла ошибка: ${error}`);

      throw new Error(`При создании клиента произошла ошибка: ${error}`);
    }
  }

  async update(id: number, data: IClient): Promise<IClient> {
    try {
      const response = await apiClient.put(`/clients/${id}`, data);

      return response.data || {};
    } catch (error) {
      notification("error", `При обновлении клиента произошла ошибка: ${error}`);

      throw new Error(`При обновлении клиента произошла ошибка: ${error}`);
    }
    
  }

  async delete(id: number): Promise<IClient | {}> {
    try {
      const response = await apiClient.delete(`/clients/${id}`);

      return response.data || {};
    } catch (error) {
      notification("error", `При удалении клиента произошла ошибка: ${error}`);

      throw new Error(`При удалении клиента произошла ошибка: ${error}`);
    }
  }

  findByTitle(title: string): Promise<IClient[]> {
    return apiClient.get(`/clients?title=${title}`);
  }
}

export default new ClientService();
