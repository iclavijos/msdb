export interface IDriverPointsDetails {
  id?: number;
}

export class DriverPointsDetails implements IDriverPointsDetails {
  constructor(public id?: number) {}
}
