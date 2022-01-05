export interface IPointsSystem {
  id?: number;
  name?: string;
  description?: string;
  points?: string | null;
  pointsMostLeadLaps?: number | null;
  pointsFastLap?: number | null;
  pointsPole?: number | null;
  pointsLeadLap?: number | null;
}

export class PointsSystem implements IPointsSystem {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public points?: string | null,
    public pointsMostLeadLaps?: number | null,
    public pointsFastLap?: number | null,
    public pointsPole?: number | null,
    public pointsLeadLap?: number | null
  ) {}
}

export function getPointsSystemIdentifier(pointsSystem: IPointsSystem): number | undefined {
  return pointsSystem.id;
}
