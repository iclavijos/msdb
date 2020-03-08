export interface IPointsSystem {
  id?: number;
  name?: string;
  description?: string;
  points?: string;
  pointsMostLeadLaps?: number;
  pointsFastLap?: number;
  maxPosFastLap?: number;
  dnfFastLap?: boolean;
  pitlaneStartAllowed?: boolean;
  pctCompletedFastLap?: number;
  pointsPole?: number;
  pointsLeadLap?: number;
  racePctCompleted?: number;
  pctTotalPoints?: number;
  active?: boolean;
}

export class PointsSystem implements IPointsSystem {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public points?: string,
    public pointsMostLeadLaps = 0,
    public pointsFastLap = 0,
    public maxPosFastLap = 0,
    public dnfFastLap = false,
    public pitlaneStartAllowed = false,
    public pctCompletedFastLap = 0,
    public pointsPole = 0,
    public pointsLeadLap = 0,
    public racePctCompleted = 0,
    public pctTotalPoints = 100,
    public active = true
  ) {}
}
