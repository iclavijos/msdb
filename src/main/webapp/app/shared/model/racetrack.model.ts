import { IRacetrackLayout } from './racetrack-layout.model';
import { ICountry } from 'app/shared/country/country.model';

export interface IRacetrack {
  id?: number;
  name?: string;
  location?: string;
  country?: ICountry;
  timeZone?: string;
  latitude?: number;
  longitude?: number;
  logoContentType?: string;
  logo?: any;
  logoUrl?: string;
  layouts?: IRacetrackLayout[];
}

export class Racetrack implements IRacetrack {
  constructor(
    public id?: number,
    public name?: string,
    public location?: string,
    public country?: ICountry,
    public timeZone?: string,
    public latitude?: number,
    public longitude?: number,
    public logoContentType?: string,
    public logo?: any,
    public logoUrl?: string,
    public layouts?: IRacetrackLayout[]
  ) {}
}
