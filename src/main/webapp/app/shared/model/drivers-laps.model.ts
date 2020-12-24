import { IDriverLap } from './driver-lap.model';

export interface IDriversLaps {
  raceNumber?: string;
  driverName?: string;
  laps?: IDriverLap[];
}

export class DriversLaps implements IDriversLaps {
  constructor(public raceNumber?: string, public driverName?: string, public laps?: IDriverLap[]) {}
}
