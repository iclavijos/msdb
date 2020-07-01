import { ICategory } from 'app/shared/model/category.model';
import { ISeries } from 'app/shared/model/series.model';
import { IDriver } from 'app/shared/model/driver.model';
import { ITeam } from 'app/shared/model/team.model';
import { IPointsSystem } from 'app/shared/model/points-system.model';
import { IEventEdition } from 'app/shared/model/event-edition.model';

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
    public standingsPerCategory?: boolean
  ) {
    this.singleChassis = this.singleChassis || false;
    this.singleEngine = this.singleEngine || false;
    this.singleTyre = this.singleTyre || false;
  }
}
