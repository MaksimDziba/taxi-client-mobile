export interface IOrder {
  addressFrom: string,
  addressTo: string,
  babyChair: boolean,
  location?: string,
  clientID: number,
  client?: {
    id: number, 
    name: string,
    phone: string, 
  },
  id?: number,
  maxCountPassenger: number,
  operatorName?: string,
  preOrderCost?: number,
  status: "pending" | "accepted" | "process" | "finished",
  tariff?: {
    id: number,
    type: string, 
    costPerKilometer: number,
    costOutOfCity: number,
    costBabyChair: number,
  },
  tariffID: number,
  timeOrder: null | string,
  transportationAnimals: boolean,
  createdAt?: string,
  updatedAt?: string,
}

export type OrdersGroupedByStatus = {
  [status: string]: IOrder[];
}