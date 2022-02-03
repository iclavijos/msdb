import { IEventEdition } from 'app/entities/event-edition/event-edition.model';

export interface IEvent {
  id?: number;
  name?: string;
  description?: string;
  rally?: boolean;
  raid?: boolean;
  editions?: IEventEdition[];
  isRally(): boolean;
  isRaid(): boolean;
}

export class Event implements IEvent {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public rally?: boolean,
    public raid?: boolean,
    public editions?: IEventEdition[]
  ) {}

  isRally(): boolean {
    return this.rally ?? false;
  }

  isRaid(): boolean {
    return this.raid ?? false;
  }
}

export class EditionIdYear {
  public id?: number;
  public editionYear?: number;
}

export function getEventIdentifier(event: IEvent): number | undefined {
  return event.id;
}
