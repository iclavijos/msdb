import { ILapData } from './lap-data.model';

export interface IDriverAverages {
  raceNumber?: string;
  driverName?: string;
  category?: string;
  best5Avg?: number;
  best10Avg?: number;
  best20Avg?: number;
  best50Avg?: number;
  average110?: number;
  bestLaps?: ILapData[];
  averagePerStint?: number[];
  lapsStint?: number[];
  bestS1?: number;
  bestS2?: number;
  bestS3?: number;
  q1?: number;
  q3?: number;
}

export class DriverAverages implements IDriverAverages {
  constructor(
    public raceNumber?: string,
    public driverName?: string,
    public category?: string,
    public best5Avg?: number,
    public best10Avg?: number,
    public best20Avg?: number,
    public best50Avg?: number,
    public average110?: number,
    public bestLaps?: ILapData[],
    public averagePerStint?: number[],
    public lapsStint?: number[],
    public bestS1?: number,
    public bestS2?: number,
    public bestS3?: number,
    public q1?: number,
    public q3?: number
  ) {}
}
