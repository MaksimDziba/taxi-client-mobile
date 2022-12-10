import IVehicle from "./Vehicle";

interface IDriver {
  id: number;
  name: string;
  passport: string;
  address: string;
  phone: string;
  driverLicense: string;
  contractNumber: string;
  paymentMethod: string;
  transportationAnimals: boolean;
  vehicles: IVehicle[];
}

interface IDriverCreate {
  name: string;
  passport: string;
  address: string;
  phone: string;
  driverLicense: string;
  contractNumber: string;
  paymentMethod: string;
  transportationAnimals: boolean;
  vehicles?: IVehicle[];
}

export { IDriver, IDriverCreate };
