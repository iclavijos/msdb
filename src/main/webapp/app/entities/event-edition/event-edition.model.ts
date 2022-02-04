import { ICategory } from 'app/entities/category/category.model';
import { IRacetrackLayout } from 'app/entities/racetrack-layout/racetrack-layout.model';
import { ISeriesEdition } from 'app/entities/series-edition/series-edition.model';
import { IEvent } from 'app/entities/event/event.model';
import { IEventSession } from 'app/entities/event-session/event-session.model';

import { DateTime } from 'luxon';

export interface IEventEdition {
  id?: number;
  previousEditionId?: number;
  nextEditionId?: number;
  editionYear?: number;
  shortEventName?: string;
  longEventName?: string;
  eventDate?: DateTime;
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
  isRally(): boolean;
  isRaid(): boolean;
}

export class EventEdition implements IEventEdition {
  constructor(
    public id?: number,
    public previousEditionId?: number,
    public nextEditionId?: number,
    public editionYear?: number,
    public shortEventName?: string,
    public longEventName?: string,
    public eventDate?: DateTime,
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
    public status?: string,
    public seriesEditions?: ISeriesEdition[],
    public location?: string,
    public locationTimeZone?: string,
    public latitude?: number,
    public longitude?: number
  ) {}

  isRally(): boolean {
    return this.event!.rally ?? false;
  }

  isRaid(): boolean {
    return this.event!.raid ?? false;
  }
}

export class EventEditionAndWinners {
  public eventEdition?: IEventEdition;
  public winners?: any[];
}

export class EventsSeriesNavigation {
  public prevId!: number;
  public nextId!: number;
  public prevName!: string;
  public nextName!: string;
}

export function getEventEditionIdentifier(eventEdition: IEventEdition): number | undefined {
  return eventEdition.id;
}
