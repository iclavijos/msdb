import { IEventEdition } from 'app/entities/event-edition/event-edition.model';

export interface IEvent {
  id?: number;
  name?: string;
  description?: string;
  editions?: IEventEdition[] | null;
}

export class Event implements IEvent {
  constructor(public id?: number, public name?: string, public description?: string, public editions?: IEventEdition[] | null) {}
}

export function getEventIdentifier(event: IEvent): number | undefined {
  return event.id;
}
