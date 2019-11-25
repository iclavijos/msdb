import { Moment } from 'moment';

export interface IEventSession {
  id?: number;
  name?: string;
  shortname?: string;
  sessionStartTime?: Moment;
  duration?: number;
}

export class EventSession implements IEventSession {
  constructor(
    public id?: number,
    public name?: string,
    public shortname?: string,
    public sessionStartTime?: Moment,
    public duration?: number
  ) {}
}
