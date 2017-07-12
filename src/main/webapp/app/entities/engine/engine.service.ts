import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Engine } from './engine.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class EngineService {

    private resourceUrl = 'api/engines';
    private resourceSearchUrl = 'api/_search/engines';
    private typeAheadSearchUrl = 'api/_typeahead/engines';

    constructor(private http: Http) { }

    create(engine: Engine): Observable<Engine> {
        const copy = this.convert(engine);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(engine: Engine): Observable<Engine> {
        const copy = this.convert(engine);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Engine> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }
    
    typeahead(req?: string): Observable<ResponseWrapper> {
        return this.http.get(`${this.typeAheadSearchUrl}?query=${req}`)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(engine: Engine): Engine {
        const copy: Engine = Object.assign({}, engine);
        return copy;
    }
}
