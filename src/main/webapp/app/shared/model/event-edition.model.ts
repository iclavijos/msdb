import { ICategory } from 'app/entities/category/category.model';
import { IRacetrackLayout } from 'app/entities/racetrack-layout/racetrack-layout.model';
import { ISeriesEdition } from './series-edition.model';
import { IEvent } from './event.model';
import { IEventSession } from './event-session.model';

import * as dayjs from 'dayjs';

export interface IEventEdition {
  id?: number;
  previousEditionId?: number;
  nextEditionId?: number;
  editionYear?: number;
  shortEventName?: string;
  longEventName?: string;
  eventDate?: dayjs.Dayjs;
  allowedCategories?: ICategory[];
  trackLayout?: IRacetrackLayout;
  event?: IEvent;
  sessions?: IEventSession[];
  multidriver?: boolean;
  singleChassis?: boolean;
  singleEngine?: boolean;
  singleTyre?: boolean;
  winners?: any;
  seriesId?: number[];
  posterContentType?: string;
  poster?: any;
  posterUrl?: string;
  status?: string;
  seriesEditions?: ISeriesEdition[];
  location?: string;
  locationTimeZone?: string;
  latitude?: number;
  longitude?: number;
}

export class EventEdition implements IEventEdition {
  constructor(
    public id?: number,
    public previousEditionId?: number,
    public nextEditionId?: number,
    public editionYear?: number,
    public shortEventName?: string,
    public longEventName?: string,
    public eventDate?: dayjs.Dayjs,
    public allowedCategories?: ICategory[],
    public trackLayout?: IRacetrackLayout,
    public event?: IEvent,
    public sessions?: IEventSession[],
    public multidriver?: boolean,
    public singleChassis?: boolean,
    public singleEngine?: boolean,
    public singleTyre?: boolean,
    public winners?: any,
    public seriesId?: number[],
    public posterContentType?: string,
    public poster?: any,
    public posterUrl?: string,
    public string?: string,
    public seriesEditions?: ISeriesEdition[],
    public location?: string,
    public locationTimeZone?: string,
    public latitude?: number,
    public longitude?: number
  ) {}
}

export class EventEditionAndWinners {
  public eventEdition?: IEventEdition;
  public winners?: any[];
}
