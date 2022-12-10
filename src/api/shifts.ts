import apiClient from "./http/axios-client";

import { notification } from "../service/notification";

import { IShift } from "../interface/Shift";

class ShiftService {
  async createShift(data: IShift): Promise<IShift | {}> {
    try {
      const response = await apiClient.post("/shifts", data);

      return response.data || {};
    } catch (error) {
      notification("error", `При создании смены произошла ошибка: ${error}`);

      throw new Error(`При создании смены произошла ошибка. ${error}`);
    }
  }

  async getShifts(): Promise<{
    finished: IShift[] | [];
    working: IShift;
  }> {
    try {
      const response = await apiClient.get("/shifts");

      return response.data || {
        finished: [], 
        working: {}
      };
    } catch (error) {
      notification("error", `При получении получении смен произошла ошибка: ${error}`);

      throw new Error(`При получении получении смен произошла ошибка. ${error}`);
    }
  }

  async finishedShift(): Promise<IShift | {}> {
    try {
      const response = await apiClient.put(`/shifts/finished`);

      return response.data || {};
    } catch (error) {
      notification("error", `При обновлении смены произошла ошибка: ${error}`);

      throw new Error(`При обновлении смены произошла ошибка. ${error}`);
    }
  }
}

export default new ShiftService();
 