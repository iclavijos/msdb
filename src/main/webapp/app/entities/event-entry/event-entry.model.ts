import { Driver } from '../driver';
import { Team } from '../team';
import { Chassis } from '../chassis';
import { Engine } from '../engine';
import { TyreProvider } from '../tyre-provider';
import { FuelProvider } from '../fuel-provider';
import { Category } from '../category';
import { EventEdition } from '../event-edition';

export class EventEntry {

    constructor(
        public id?: number,
        public raceNumber?: string,
        public entryName?: string,
        public team?: Team,
        public operatedBy?: Team,
        public drivers?: Driver[],
        public chassis?: Chassis,
        public engine?: Engine,
        public tyres?: TyreProvider,
        public fuel?: FuelProvider,
        public category?: Category,
        public eventEdition?: EventEdition,
        public driversName?: string,
        public rookie?: boolean,
    ) { 
    }
    
}
