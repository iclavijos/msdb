export interface IDriverLap {
  lapNumber?: number;
  lapTime?: number;
  pitstop?: boolean;
  fastestLap?: boolean;
  fastLap?: boolean;
  personalBest?: boolean;
  s1?: number;
  s2?: number;
  s3?: number;
  category?: string;
}

export class DriverLap implements IDriverLap {
  constructor(
    public lapNumber?: number,
    public lapTime?: number,
    public pitstop?: boolean,
    public fastestLap?: boolean,
    public fastLap?: boolean,
    public personalBest?: boolean,
    public s1?: number,
    public s2?: number,
    public s3?: number,
    public category?: string
  ) {}
}
