export interface IDriversName {
  driversNames?: string;
  raceNumber?: string;
  category?: string;
}

export class DriversNames {
  constructor(public driversNames?: string, public raceNumber?: string, public category?: string) {}
}
