export interface IFuelProvider {
  id?: number;
  name?: string;
  logoContentType?: string | null;
  logo?: string | null;
}

export class FuelProvider implements IFuelProvider {
  constructor(public id?: number, public name?: string, public logoContentType?: string | null, public logo?: string | null) {}
}

export function getFuelProviderIdentifier(fuelProvider: IFuelProvider): number | undefined {
  return fuelProvider.id;
}
