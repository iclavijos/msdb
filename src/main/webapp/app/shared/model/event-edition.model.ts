import { ICategory } from 'app/shared/model/category.model';
import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { IEvent } from 'app/shared/model/event.model';
import { IEventSession } from 'app/shared/model/event-session.model';

export interface IEventEdition {
  id?: number;
  previousEditionId?: number;
  nextEditionId?: number;
  editionYear?: number;
  shortEventName?: string;
  longEventName?: string;
  eventDate?: any;
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
}

export class EventEdition implements IEventEdition {
  constructor(
    public id?: number,
    public previousEditionId?: number,
    public nextEditionId?: number,
    public editionYear?: number,
    public shortEventName?: string,
    public longEventName?: string,
    public eventDate?: any,
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
    public string?: string
  ) {}
}
