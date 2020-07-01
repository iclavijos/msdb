export interface IFuelProvider {
  id?: number;
  name?: string;
  logoContentType?: string;
  logo?: any;
  logoUrl?: string;
}

export class FuelProvider implements IFuelProvider {
  constructor(public id?: number, public name?: string, public logoContentType?: string, public logo?: any, public logoUrl?: string) {}
}
