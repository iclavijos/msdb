import { IDriver } from 'app/entities/driver/driver.model';
import { ITeam } from 'app/entities/team/team.model';

export interface IEventEntry {
  id?: number;
  teamName?: string;
  driver?: IDriver | null;
  participants?: ITeam[] | null;
}

export class EventEntry implements IEventEntry {
  constructor(public id?: number, public teamName?: string, public driver?: IDriver | null, public participants?: ITeam[] | null) {}
}

export function getEventEntryIdentifier(eventEntry: IEventEntry): number | undefined {
  return eventEntry.id;
}
