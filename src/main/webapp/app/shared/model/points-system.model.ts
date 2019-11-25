export interface IPointsSystem {
  id?: number;
  name?: string;
  description?: string;
  points?: string;
  pointsMostLeadLaps?: number;
  pointsFastLap?: number;
  pointsPole?: number;
  pointsLeadLap?: number;
}

export class PointsSystem implements IPointsSystem {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public points?: string,
    public pointsMostLeadLaps?: number,
    public pointsFastLap?: number,
    public pointsPole?: number,
    public pointsLeadLap?: number
  ) {}
}
