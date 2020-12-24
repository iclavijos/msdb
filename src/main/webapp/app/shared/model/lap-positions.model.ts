import { IDriverPosition } from './driver-position.model';

export interface ILapPositions {
  lapNumber?: number;
  racePositions?: IDriverPosition[];
}

export class LapPositions implements ILapPositions {
  constructor(public lapNumber?: number, public racePositions?: IDriverPosition[]) {}
}
