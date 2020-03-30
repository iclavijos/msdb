import { IDriver } from 'app/shared/model/driver.model';
import { ITeam } from 'app/shared/model/team.model';
import { IChassis } from 'app/shared/model/chassis.model';
import { IEngine } from 'app/shared/model/engine.model';
import { ITyreProvider } from 'app/shared/model/tyre-provider.model';
import { IFuelProvider } from 'app/shared/model/fuel-provider.model';
import { ICategory } from 'app/shared/model/category.model';
import { IEventEdition } from 'app/shared/model/event-edition.model';

export interface IEventEntry {
  id?: number;
  raceNumber?: string;
  entryName?: string;
  team?: ITeam;
  operatedBy?: ITeam;
  drivers?: IDriver[];
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
    public drivers?: IDriver[],
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
