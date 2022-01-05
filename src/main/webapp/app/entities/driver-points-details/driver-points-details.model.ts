export interface IDriverPointsDetails {
  id?: number;
}

export class DriverPointsDetails implements IDriverPointsDetails {
  constructor(public id?: number) {}
}

export function getDriverPointsDetailsIdentifier(driverPointsDetails: IDriverPointsDetails): number | undefined {
  return driverPointsDetails.id;
}
