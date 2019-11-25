import { Moment } from 'moment';
import { ICategory } from 'app/shared/model/category.model';
import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { IEvent } from 'app/shared/model/event.model';

export interface IEventEdition {
  id?: number;
  editionYear?: number;
  shortEventName?: string;
  longEventName?: string;
  eventDate?: Moment;
  allowedCategories?: ICategory;
  trackLayout?: IRacetrackLayout;
  event?: IEvent;
}

export class EventEdition implements IEventEdition {
  constructor(
    public id?: number,
    public editionYear?: number,
    public shortEventName?: string,
    public longEventName?: string,
    public eventDate?: Moment,
    public allowedCategories?: ICategory,
    public trackLayout?: IRacetrackLayout,
    public event?: IEvent
  ) {}
}
