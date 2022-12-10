export interface IShift {
  id: number;

  status: string;

  startTime: Date;

  endTime: Date;

  priority: number;

  gosNumber: string;

  carModel: string;

  carColor: string;

  driverID: number;

  orders?: any[];
}
