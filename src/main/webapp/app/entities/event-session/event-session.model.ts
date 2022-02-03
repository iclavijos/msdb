import * as dayjs from 'dayjs';
import { IEventEdition } from 'app/entities/event-edition/event-edition.model';

import { DurationType } from 'app/shared/enumerations/durationType.enum';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

export interface IEventSession {
  id?: number;
  name?: string;
  shortname?: string;
  sessionStartTime?: dayjs.Dayjs;
  originalStartTime?: dayjs.Dayjs;
  duration?: number;
  totalDuration?: number;
  maxDuration?: number;
  durationType?: DurationType;
  additionalLap?: boolean;
  sessionType?: SessionType;
  sessionTypeValue?: number;
  eventEdition?: IEventEdition;
  pointsSystemsSession?: any;
  location?: string;
  locationTimeZone?: string;
  sessionStartTimeDate?: number;
}

export class EventSession implements IEventSession {
  constructor(
    public id?: number,
    public name?: string,
    public shortname?: string,
    public sessionStartTime?: dayjs.Dayjs,
    public originalStartTime?: dayjs.Dayjs,
    public duration?: number,
    public totalDuration?: number,
    public maxDuration?: number,
    public durationType?: DurationType,
    public additionalLap = false,
    public sessionType?: SessionType,
    public sessionTypeValue?: number,
    public eventEdition?: IEventEdition,
    public pointsSystemsSession?: any,
    public location?: string,
    public locationTimeZone?: string,
    public sessionStartTimeDate?: number
  ) {}
}

export function getEventSessionIdentifier(eventSession: IEventSession): number | undefined {
  return eventSession.id;
}
