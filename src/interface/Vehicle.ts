import { IDriver } from "./Driver";

export interface IVehicle {
  id?: number;
  gosNumber: string;
  dateManufacture: Date | string;
  carModel: string;
  carColor: string;
  capacity: string | null;
  babyChair: boolean;
  maxCountPassenger: number | null;
  drivers: IDriver[];
}
