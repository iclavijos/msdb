import { Moment } from 'moment';
import { IEventEdition } from './event-edition.model';

import { DurationType } from '../enumerations/durationType.enum';
import { SessionType } from '../enumerations/sessionType.enum';

export interface IEventSession {
  id?: number;
  name?: string;
  shortname?: string;
  sessionStartTime?: Moment;
  originalStartTime?: Moment;
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
  cancelled?: boolean;
}

export class EventSession implements IEventSession {
  constructor(
    public id?: number,
    public name?: string,
    public shortname?: string,
    public sessionStartTime?: Moment,
    public originalStartTime?: Moment,
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
    public cancelled?: boolean
  ) {}
}
