import { ICountry } from 'app/entities/country/country.model';

import * as dayjs from 'dayjs';

export interface IDriver {
  id?: number;
  name?: string;
  surname?: string;
  birthDate?: dayjs.Dayjs;
  birthPlace?: string;
  nationality?: ICountry;
  deathDate?: dayjs.Dayjs | null;
  deathPlace?: string;
  portraitContentType?: string;
  portrait?: any;
  portraitUrl?: string;
  age?: number;
  getDriverFaceImageUrl(): string;
  getCompositeName(): string;
}

export class Driver implements IDriver {
  constructor(
    public id?: number,
    public name?: string,
    public surname?: string,
    public birthDate?: dayjs.Dayjs,
    public birthPlace?: string,
    public nationality?: ICountry,
    public deathDate?: dayjs.Dayjs | null,
    public deathPlace?: string,
    public portraitContentType?: string,
    public portrait?: any,
    public portraitUrl?: string,
    public age?: number
  ) {
    if (deathDate) {
      this.age = deathDate.diff(birthDate, 'year');
    } else {
      this.age = birthDate?.diff(dayjs(), 'year');
    }
  }

  getCompositeName(): string {
    return `${this.surname}, ${this.name}`
  }

  getDriverFaceImageUrl(): string {
    const tmpFaceUrl = this.portraitUrl
            ? this.portraitUrl
            : 'https://res.cloudinary.com/msdb-cloud/image/upload/v1518113603/generic.png';
    return tmpFaceUrl.replace('upload/', 'upload/w_300,h_300,c_thumb,g_face/');
  }
}

export function getDriverIdentifier(driver: IDriver): number | undefined {
  return driver.id;
}
