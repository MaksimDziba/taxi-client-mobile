import apiClient from './http/axios-client';

import { notification } from '../service/notification';

import { IOrder } from '../interface/Order';

class OrderService {
  async getAll(): Promise<IOrder[] | []> {
    try {
      const response = await apiClient.get('/orders');

      return response.data || [];
    } catch (error) {
      notification('error', `При получении заказов произошла ошибка: ${error}`);

      throw new Error(`При получении заказов произошла ошибка: ${error}`);
    }
  }

  async get(id: any): Promise<any> {
    try {
      const response = await apiClient.get(`/orders/${id}`);

      return response.data || {};
    } catch (error) {
      notification('error', `При получении заказа произошла ошибка: ${error}`);

      throw new Error(`При получении заказа произошла ошибка: ${error}`);
    }
  }

  async create(data: IOrder): Promise<IOrder | {}> {
    try {
      const response = await apiClient.post('/orders', data);

      return response.data || {};
    } catch (error) {
      notification('error', `При создании заказа произошла ошибка: ${error}`);

      throw new Error(`При создании заказа произошла ошибка: ${error}`);
    }
  }

  async update(id: number, data: string): Promise<IOrder | {}> {
    try {
      const response = await apiClient.put(`/orders/${id}`, data);

      return response.data || {};
    } catch (error) {
      notification('error', `При обновлении заказа произошла ошибка: ${error}`);

      throw new Error(`При обновлении заказа произошла ошибка: ${error}`);
    }
  }

  async delete(id: number): Promise<IOrder | {}> {
    try {
      const response = await apiClient.delete(`/orders/${id}`);

      return response.data || {};
    } catch (error) {
      notification('error', `При удалении заказа произошла ошибка: ${error}`);

      throw new Error(`При удалении заказа произошла ошибка: ${error}`);
    }
  }

  async findByTitle(title: string): Promise<IOrder[] | []> {
    try {
      const response = await apiClient.get(`/orders?title=${title}`);

      return response.data || [];
    } catch (error) {
      notification('error', `При поиске заказов произошла ошибка: ${error}`);

      throw new Error(`При поиске заказов произошла ошибка: ${error}`);
    }
  }
}

export default new OrderService();
