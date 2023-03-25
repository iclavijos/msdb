import { IEventEdition } from 'app/entities/event-edition/event-edition.model';

export interface IEvent {
  id?: number;
  name?: string;
  description?: string;
  rally?: boolean;
  raid?: boolean;
  editions?: IEventEdition[];
}

export class Event implements IEvent {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public rally?: boolean,
    public raid?: boolean,
    public editions?: IEventEdition[]
  ) {
    this.rally = this.rally ?? false;
    this.raid = this.raid ?? false;
  }
}

export class EditionIdYear {
  public id?: number;
  public editionYear?: number;
}

export function getEventIdentifier(event: IEvent): number | undefined {
  return event.id;
}

export function isRally(event: IEvent): boolean {
  return event.rally ?? false;
}

export function isRaid(event: IEvent): boolean {
  return event.raid ?? false;
}

export function instantiateEvent(event: IEvent): Event {
  return new Event(
    event.id,
    event.name,
    event.description,
    event.rally,
    event.raid,
    event.editions
  );
}
