import { Category } from '../category';
import { Series } from '../series';
import { Driver } from '../driver';
import { Team } from '../team';
import { PointsSystem } from '../points-system';
import { EventEdition } from '../event-edition';

export class SeriesEdition {
    constructor(
        public id?: number,
        public editionName?: string,
        public period?: string,
        public singleChassis?: boolean,
        public singleEngine?: boolean,
        public singleTyre?: boolean,
        public allowedCategories?: Category[],
        public series?: Series,
        public numEvents?: number,
        public driverChamp?: Driver,
        public teamChamp?: Team,
        public manufacturerChamp?: string,
        public pointsSystems?: PointsSystem[],
        public events?: EventEdition[],
        public driversStandings?: boolean,
        public teamsStandings?: boolean,
        public manufacturersStandings?: boolean
    ) { }
}
