import { Moment } from 'moment';

export interface ICountry {
  id?: number;
  countryCode?: string;
  countryName?: string;
  flagImg?: string;
}

export class Country implements ICountry {
  constructor(public id?: number, public countryCode?: string, public countryName?: string, public flagImg?: string) {}
}
