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
  getDriverFaceImageUrl(size?: number): string;
  getFullName(): string;
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
      this.age = dayjs().diff(birthDate, 'year');
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
