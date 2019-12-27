import { ICountry } from 'app/shared/country/country.model';

import { Moment } from 'moment';

export interface IDriver {
  id?: number;
  name?: string;
  surname?: string;
  birthDate?: Moment;
  birthPlace?: string;
  nationality?: ICountry;
  deathDate?: Moment;
  deathPlace?: string;
  portraitContentType?: string;
  portrait?: any;
  portraitUrl?: string;
}

export class Driver implements IDriver {
  constructor(
    public id?: number,
    public name?: string,
    public surname?: string,
    public birthDate?: Moment,
    public birthPlace?: string,
    public nationality?: ICountry,
    public deathDate?: Moment,
    public deathPlace?: string,
    public portraitContentType?: string,
    public portrait?: any,
    public portraitUrl?: string
  ) {}
}
