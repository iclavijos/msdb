import { EventEntry } from '../event-entry';
export class Driver {
    constructor(
        public id?: number,
        public name?: string,
        public surname?: string,
        public birthDate?: any,
        public birthPlace?: string,
        public deathDate?: any,
        public deathPlace?: string,
        public portrait?: any
    ) { }
    
    fullName() {
        return this.surname + ', ' + this.name;
    }
}
