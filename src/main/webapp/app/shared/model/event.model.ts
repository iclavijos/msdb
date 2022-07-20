import { IEventEdition } from './event-edition.model';

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
  ) {}
}