export interface IEngine {
  id?: number;
  name?: string;
  manufacturer?: string;
  capacity?: number;
  architecture?: string;
  debutYear?: number;
  petrolEngine?: boolean;
  dieselEngine?: boolean;
  electricEngine?: boolean;
  otherEngine?: boolean;
  rebranded?: boolean;
  turbo?: boolean;
  imageContentType?: string;
  image?: any;
  imageUrl?: string;
  derivedFrom?: IEngine;
  evolutions?: IEngine[];
}

export class Engine implements IEngine {
  constructor(
    public id?: number,
    public name?: string,
    public manufacturer?: string,
    public capacity?: number,
    public architecture?: string,
    public debutYear?: number,
    public petrolEngine?: boolean,
    public dieselEngine?: boolean,
    public electricEngine?: boolean,
    public otherEngine?: boolean,
    public rebranded?: boolean,
    public turbo?: boolean,
    public imageContentType?: string,
    public image?: any,
    public imageUrl?: string,
    public derivedFrom?: IEngine,
    public evolutions?: IEngine[]
  ) {
    this.petrolEngine = this.petrolEngine ?? false;
    this.dieselEngine = this.dieselEngine ?? false;
    this.electricEngine = this.electricEngine ?? false;
    this.otherEngine = this.otherEngine ?? false;
    this.turbo = this.turbo ?? false;
    this.evolutions = this.evolutions ?? [];
  }
}

export function getEngineIdentifier(engine: IEngine): number | undefined {
  return engine.id;
}
