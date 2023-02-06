export interface IShift {
  id: number;
  status: string;
  startTime: Date;
  endTime: Date;
  priority: number;
  carColor: string;
  carModel: string;
  carNumber: string;
  driverID: number;
  orders?: any[];
}

export interface IShiftCreate {
  status: string;
  carColor: string;
  carModel: string;
  carNumber: string;
  driverID: number;
}