import { IDriverEntry } from './driver-entry.model';
import { ITeam } from './team.model';
import { IChassis } from './chassis.model';
import { IEngine } from './engine.model';
import { ITyreProvider } from './tyre-provider.model';
import { IFuelProvider } from './fuel-provider.model';
import { ICategory } from './category.model';
import { IEventEdition } from './event-edition.model';

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
