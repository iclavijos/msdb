export interface ITyreProvider {
    id?: number;
    name?: string;
    logoContentType?: string;
    logo?: any;
}

export class TyreProvider implements ITyreProvider {
    constructor(public id?: number, public name?: string, public logoContentType?: string, public logo?: any) {}
}
