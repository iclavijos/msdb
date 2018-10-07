export class TyreProvider {
    constructor(
        public id?: number,
        public name?: string,
        public logo?: any,
        public logoContentType?: any,
        public logoUrl?: string,
        public letterColor = "#000000",
        public backgroundColor = "#FFFFFF"
    ) { }
}
