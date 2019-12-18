import { LapData } from './lap-data.model';

export class DriverAverages {
  driverName: string;
  best5Avg?: number;
  best10Avg?: number;
  best20Avg?: number;
  average110?: number;
  bestLaps?: LapData[];
  averagePerStint?: number[];
  lapsStint?: number[];
  bestS1?: number;
  bestS2?: number;
  bestS3?: number;
}
