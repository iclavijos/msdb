import { IEventSession } from 'app/shared/model/event-session.model';
import { IEventEntry } from 'app/shared/model/event-entry.model';

export interface IEventEntryResult {
  id?: number;
  startingPosition?: number;
  finalPosition?: number;
  totalTime?: number;
  bestLapTime?: number;
  lapsCompleted?: number;
  lapsLed?: number;
  difference?: number;
  differenceType?: number;
  retired?: boolean;
  cause?: string;
  pitlaneStart?: boolean;
  entry?: IEventEntry;
  session?: IEventSession;
  sharedWith?: IEventEntry;
}

export class EventEntryResult implements IEventEntryResult {
  constructor(
    public id?: number,
    public startingPosition?: number,
    public finalPosition?: number,
    public totalTime?: number,
    public bestLapTime?: number,
    public lapsCompleted?: number,
    public lapsLed?: number,
    public difference?: number,
    public differenceType?: number,
    public retired?: boolean,
    public cause?: string,
    public pitlaneStart?: boolean,
    public entry?: IEventEntry,
    public session?: IEventSession,
    public sharedWith?: IEventEntry
  ) {
    this.retired = this.retired || false;
  }
}
