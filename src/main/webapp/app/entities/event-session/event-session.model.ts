import * as dayjs from 'dayjs';

export interface IEventSession {
  id?: number;
  name?: string;
  shortname?: string;
  sessionStartTime?: dayjs.Dayjs;
  duration?: number;
}

export class EventSession implements IEventSession {
  constructor(
    public id?: number,
    public name?: string,
    public shortname?: string,
    public sessionStartTime?: dayjs.Dayjs,
    public duration?: number
  ) {}
}

export function getEventSessionIdentifier(eventSession: IEventSession): number | undefined {
  return eventSession.id;
}
