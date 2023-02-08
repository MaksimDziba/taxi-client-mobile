import apiClient from "./http/axios-client";

import { notification } from "../service/notification";

import { IShift, IShiftCreate } from "../interface/Shift";

class ShiftService {
  async createShift(data: IShiftCreate): Promise<IShift | {}> {
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

  async finishedShift(id: number): Promise<IShift | {}> {
    try {
      const response = await apiClient.put(`/shifts/${id}/finished`);

      return response.data || {};
    } catch (error) {
      notification("error", `При завершении смены произошла ошибка: ${error}`);

      throw new Error(`При завершении смены произошла ошибка: ${error}`);
    }
  }

  async assignOrderToShift(orderID: number, shiftID: number) {
    try {
      await apiClient.post('/shifts/assign-order-to-shift', {
          orderID,
          shiftID,
      })
    } catch (error) {
      notification("error", `При взятии заказа произошла ошибка: ${error}`);

      throw new Error(`При взятии заказа произошла ошибка: ${error}`);
    }
  }
}

export default new ShiftService();
 