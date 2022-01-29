import { IDriverEntry } from './driver-entry.model';
import { ITeam } from 'app/entities/team/team.model';
import { IChassis } from 'app/entities/chassis/chassis.model';
import { IEngine } from 'app/entities/engine/engine.model';
import { ITyreProvider } from 'app/entities/tyre-provider/tyre-provider.model';
import { IFuelProvider } from 'app/entities/fuel-provider/fuel-provider.model';
import { ICategory } from 'app/entities/category/category.model';
import { IEventEdition } from 'app/entities/event-edition/event-edition.model';

export interface IEventEntry {
  id?: number;
  raceNumber?: string;
  entryName?: string;
  team?: ITeam;
  operatedBy?: ITeam;
  drivers?: IDriverEntry[];
  chassis?: IChassis;
  engine?: IEngine;
  tyres?: ITyreProvider;
  fuel?: IFuelProvider;
  category?: ICategory;
  eventEdition?: IEventEdition;
  driversName?: string;
  rookie?: boolean;
  carImage?: any;
  carImageContentType?: any;
  carImageUrl?: string;
}

export class EventEntry implements IEventEntry {
  constructor(
    public id?: number,
    public raceNumber?: string,
    public entryName?: string,
    public team?: ITeam,
    public operatedBy?: ITeam,
    public drivers?: IDriverEntry[],
    public chassis?: IChassis,
    public engine?: IEngine,
    public tyres?: ITyreProvider,
    public fuel?: IFuelProvider,
    public category?: ICategory,
    public eventEdition?: IEventEdition,
    public driversName?: string,
    public rookie?: boolean,
    public carImage?: any,
    public carImageContentType?: any,
    public carImageUrl?: string
  ) {}
}

export function getEventEntryIdentifier(eventEntry: IEventEntry): number | undefined {
  return eventEntry.id;
}
