import { ICar } from 'app/shared/model/car.model';
import { IDriver } from 'app/shared/model/driver.model';
import { ITeam } from 'app/shared/model/team.model';

export interface IEventEntry {
  id?: number;
  teamName?: string;
  car?: ICar;
  driver?: IDriver;
  participants?: ITeam[];
}

export class EventEntry implements IEventEntry {
  constructor(public id?: number, public teamName?: string, public car?: ICar, public driver?: IDriver, public participants?: ITeam[]) {}
}
