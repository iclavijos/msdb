import * as dayjs from 'dayjs';
import { ICategory } from 'app/entities/category/category.model';
import { IRacetrackLayout } from 'app/entities/racetrack-layout/racetrack-layout.model';
import { IEvent } from 'app/entities/event/event.model';

export interface IEventEdition {
  id?: number;
  editionYear?: number;
  shortEventName?: string;
  longEventName?: string;
  eventDate?: dayjs.Dayjs;
  allowedCategories?: ICategory | null;
  trackLayout?: IRacetrackLayout | null;
  event?: IEvent | null;
}

export class EventEdition implements IEventEdition {
  constructor(
    public id?: number,
    public editionYear?: number,
    public shortEventName?: string,
    public longEventName?: string,
    public eventDate?: dayjs.Dayjs,
    public allowedCategories?: ICategory | null,
    public trackLayout?: IRacetrackLayout | null,
    public event?: IEvent | null
  ) {}
}

export function getEventEditionIdentifier(eventEdition: IEventEdition): number | undefined {
  return eventEdition.id;
}
