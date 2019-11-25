import { IEventEntry } from 'app/shared/model/event-entry.model';

export interface ITeam {
  id?: number;
  name?: string;
  description?: string;
  hqLocation?: string;
  logoContentType?: string;
  logo?: any;
  participations?: IEventEntry[];
}

export class Team implements ITeam {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public hqLocation?: string,
    public logoContentType?: string,
    public logo?: any,
    public participations?: IEventEntry[]
  ) {}
}
