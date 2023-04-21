import apiClient from "./http/axios-client";

import { notification } from "../service/notification";

import { IClient } from "../interface/Client";
import { OrdersGroupedByStatus } from "../interface/Order";

class ClientService {
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

  async getOrders(id: number): Promise<OrdersGroupedByStatus> {
    try {
      const response = await apiClient.get(`/clients/${id}/orders/`);

      return response.data || [];
    } catch (error) {
      notification("error", `При получении заказов клиента произошла ошибка: ${error}`);

      throw new Error(`При получении заказов клиента произошла ошибка: ${error}`);
    }
  }
}

export default new ClientService();
