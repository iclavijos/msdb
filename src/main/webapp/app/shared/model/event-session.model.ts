import { Moment } from 'moment';
import { IEventEdition } from 'app/shared/model/event-edition.model';

import { IPointsSystem } from 'app/shared/model/points-system.model';
import { DurationType } from 'app/shared/enumerations/durationType.enum';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

export interface IEventSession {
  id?: number;
  name?: string;
  shortname?: string;
  sessionStartTime?: Moment;
  originalStartTime?: Moment;
  duration?: number;
  maxDuration?: number;
  durationType?: DurationType;
  additionalLap?: boolean;
  sessionType?: SessionType;
  sessionTypeValue?: number;
  eventEdition?: IEventEdition;
  pointsSystemsSession?: any;
}

export class EventSession implements IEventSession {
  constructor(
    public id?: number,
    public name?: string,
    public shortname?: string,
    public sessionStartTime?: Moment,
    public originalStartTime?: Moment,
    public duration?: number,
    public maxDuration?: number,
    public durationType?: DurationType,
    public additionalLap = false,
    public sessionType?: SessionType,
    public sessionTypeValue?: number,
    public eventEdition?: IEventEdition,
    public pointsSystemsSession?: any
  ) {}
}
