import { IEventEdition } from 'app/shared/model/event-edition.model';

export interface IEvent {
    id?: number;
    name?: string;
    description?: string;
    editions?: IEventEdition[];
}

export class Event implements IEvent {
    constructor(public id?: number, public name?: string, public description?: string, public editions?: IEventEdition[]) {}
}
