import * as dayjs from 'dayjs';
import { IEventEntry } from 'app/entities/event-entry/event-entry.model';

export interface IDriver {
  id?: number;
  name?: string;
  surname?: string;
  birthDate?: dayjs.Dayjs;
  birthPlace?: string | null;
  deathDate?: dayjs.Dayjs | null;
  deathPlace?: string | null;
  portraitContentType?: string | null;
  portrait?: string | null;
  participations?: IEventEntry[] | null;
}

export class Driver implements IDriver {
  constructor(
    public id?: number,
    public name?: string,
    public surname?: string,
    public birthDate?: dayjs.Dayjs,
    public birthPlace?: string | null,
    public deathDate?: dayjs.Dayjs | null,
    public deathPlace?: string | null,
    public portraitContentType?: string | null,
    public portrait?: string | null,
    public participations?: IEventEntry[] | null
  ) {}
}

export function getDriverIdentifier(driver: IDriver): number | undefined {
  return driver.id;
}
