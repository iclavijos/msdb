import { ICategory } from 'app/entities/category/category.model';
import { ISeries } from './series.model';
import { IDriver } from './driver.model';
import { ITeam } from './team.model';
import { IPointsSystem } from './points-system.model';
import { IEventEdition } from './event-edition.model';

export interface ISeriesEdition {
  id?: number;
  editionName?: string;
  period?: string;
  singleChassis?: boolean;
  singleEngine?: boolean;
  singleTyre?: boolean;
  allowedCategories?: ICategory[];
  series?: ISeries;
  numEvents?: number;
  driverChamp?: IDriver;
  teamChamp?: ITeam;
  manufacturerChamp?: string;
  pointsSystems?: IPointsSystem[];
  events?: IEventEdition[];
  driversStandings?: boolean;
  teamsStandings?: boolean;
  manufacturersStandings?: boolean;
  standingsPerCategory?: boolean;
  logoContentType?: string;
  logo?: any;
  logoUrl?: string;
}

export class SeriesEdition implements ISeriesEdition {
  constructor(
    public id?: number,
    public editionName?: string,
    public period?: string,
    public singleChassis?: boolean,
    public singleEngine?: boolean,
    public singleTyre?: boolean,
    public allowedCategories?: ICategory[],
    public series?: ISeries,
    public numEvents?: number,
    public driverChamp?: IDriver,
    public teamChamp?: ITeam,
    public manufacturerChamp?: string,
    public pointsSystems?: IPointsSystem[],
    public events?: IEventEdition[],
    public driversStandings?: boolean,
    public teamsStandings?: boolean,
    public manufacturersStandings?: boolean,
    public standingsPerCategory?: boolean,
    public logoContentType?: string,
    public logo?: any,
    public logoUrl?: string
  ) {
    this.singleChassis = this.singleChassis ?? false;
    this.singleEngine = this.singleEngine ?? false;
    this.singleTyre = this.singleTyre ?? false;
  }
}
