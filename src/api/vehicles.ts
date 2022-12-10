import apiClient from "./http/axios-client";

import { notification } from "../service/notification";

import { IVehicle } from "../interface/Vehicle";

class VehicleService {
  async getAll(): Promise<IVehicle[] | []> {
    try {
      const response = await apiClient.get("/vehicles");

      return response.data || [];
    } catch (error) {
      notification("error", `При получении транспортных средств произошла ошибка: ${error}`);

      throw new Error(
        `При получении транспортных средств произошла ошибка: ${error}`
      );
    }
  }

  async get(id: number): Promise<IVehicle | {}> {
    try {
      const response = await apiClient.get(`/vehicles/${id}`);

      return response.data || {};
    } catch (error) {
      notification("error", `При получении транспортного средства произошла ошибка: ${error}`);

      throw new Error(
        `При получении транспортного средства произошла ошибка: ${error}`
      );
    }
  }

  async create(data: IVehicle): Promise<IVehicle> {
    try {
      const response = await apiClient.post("/vehicles", data);

      return response.data;
    } catch (error) {
      notification("error", `При создании ТС произошла ошибка: ${error}`);

      throw new Error(`При создании ТС произошла ошибка: ${error}`);
    }
  }

  async update(id: number, data: any): Promise<IVehicle | {}> {
    try {
      const response = await apiClient.put(`/vehicles/${id}`, data);

      return response.data || {};
    } catch (error) {
      notification("error", `При обновлении ТС произошла ошибка: ${error}`);

      throw new Error(`При обновлении ТС произошла ошибка: ${error}`);
    }
  }

  async delete(id: number): Promise<IVehicle | {}> {
    try {
      const response = await apiClient.delete(`/vehicles/${id}`);

      return response.data || {};
    } catch (error) {
      notification("error", `При удалении ТС произошла ошибка: ${error}`);

      throw new Error(`При удалении ТС произошла ошибка: ${error}`);
    }
  }

  async findByTitle(title: string): Promise<IVehicle | {}> {
    try {
      const response = await apiClient.get(`/vehicles?title=${title}`);

      return response.data || {};
    } catch (error) {
      notification("error", `При поиске ТС произошла ошибка: ${error}`);

      throw new Error(`При поиске ТС произошла ошибка: ${error}`);
    }
  }
}

export default new VehicleService();
