import apiClient from "./http/axios-client";

import { notification } from "../service/notification";

import { ITariff } from "../interface/Tariff";

class TariffService {
  async getAll(params: object): Promise<ITariff[] | []>  {
    try {
      const response = await apiClient.get("/tariffs", {
        params,
      });

      return response.data || [];
    } catch (error) {
      notification("error", `При получении тарифов произошла ошибка: ${error}`);

      throw new Error(`При получении тарифов произошла ошибка: ${error}`);
    }
  }

  async get(id: number): Promise<ITariff | {}> {
    try {
      const response = await apiClient.get(`/tariffs/${id}`);

      return response.data || {};
    } catch (error) {
      notification("error", `При получении тарифа произошла ошибка: ${error}`);

      throw new Error(`При получении тарифа произошла ошибка: ${error}`);
    }
  }

  async create(data: ITariff): Promise<ITariff> {
    try {
      const response = await apiClient.post("/tariffs", data);

      return response.data;
    } catch (error) {
      notification("error", `При создании тарифа произошла ошибка: ${error}`);

      throw new Error(`При создании тарифа произошла ошибка: ${error}`);
    }
  }

  async update(id: number, data: ITariff): Promise<ITariff | {}> {
    try {
      const response = await apiClient.put(`/tariffs/${id}`, data);

      return response.data || {};
    } catch (error) {
      notification("error", `При обновлении тарифа произошла ошибка: ${error}`);

      throw new Error(`При обновлении тарифа произошла ошибка: ${error}`);
    }
  }

  async delete(id: number): Promise<ITariff | {}> {
    try {
      const response = await apiClient.delete(`/tariffs/${id}`);

      return response.data;
    } catch (error) {
      notification("error", `При удалении тарифа произошла ошибка: ${error}`);

      throw new Error(`При удалении тарифа произошла ошибка: ${error}`);
    }
  }

  async findByTitle(title: string): Promise<ITariff | {}> {
    try {
      const response = await apiClient.get(`/tariffs?title=${title}`);

      return response.data || {};
    } catch (error) {
      notification("error", `При удалении тарифа произошла ошибка: ${error}`);

      throw new Error(`При удалении тарифа произошла ошибка: ${error}`);
    }
  }
}

export default new TariffService();
