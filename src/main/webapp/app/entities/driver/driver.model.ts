import { ICountry } from 'app/entities/country/country.model';

import { DateTime } from 'luxon';

export interface IDriver {
  id?: number;
  name?: string;
  surname?: string;
  birthDate?: DateTime;
  birthPlace?: string;
  nationality?: ICountry;
  deathDate?: DateTime | null;
  deathPlace?: string;
  portraitContentType?: string;
  portrait?: any;
  portraitUrl?: string;
  age?: number;
  getDriverFaceImageUrl(size?: number): string;
  getFullName(): string;
  getCompositeName(): string;
}

export class Driver implements IDriver {
  constructor(
    public id?: number,
    public name?: string,
    public surname?: string,
    public birthDate?: DateTime,
    public birthPlace?: string,
    public nationality?: ICountry,
    public deathDate?: DateTime | null,
    public deathPlace?: string,
    public portraitContentType?: string,
    public portrait?: any,
    public portraitUrl?: string,
    public age?: number
  ) {
    if (birthDate) {
      if (deathDate) {
        this.age = Math.floor(deathDate.diff(birthDate, 'years').as('years'));
      } else {
        this.age = Math.floor(DateTime.now().diff(birthDate, 'years').as('years'));
      }
    }
  }

  getFullName(): string {
    return `${this.name} ${this.surname}`
  }

  getCompositeName(): string {
    return `${this.surname}, ${this.name}`
  }

  getDriverFaceImageUrl(size = 300): string {
    const tmpFaceUrl = this.portraitUrl
            ? this.portraitUrl
            : 'https://res.cloudinary.com/msdb-cloud/image/upload/v1518113603/generic.png';
    return tmpFaceUrl.replace('upload/', `upload/w_${size},h_${size},c_thumb,g_face/`);
  }
}

export function getDriverIdentifier(driver: IDriver): number | undefined {
  return driver.id;
}
