export interface IDriverPosition {
  raceNumber?: string;
  driverName?: string;
  position?: number;
  accumulatedRaceTime?: number;
  tyreCompound?: string;
}

export class DriverPosition implements IDriverPosition {
  constructor(
    public raceNumber?: string,
    public driverName?: string,
    public position?: number,
    public accumulatedRaceTime?: number,
    public tyreCompound?: string
  ) {}
}
