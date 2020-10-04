export interface IDriverPosition {
  raceNumber?: string;
  position?: number;
}

export class DriverPosition implements IDriverPosition {
  constructor(public raceNumber?: string, public position?: number) {}
}
