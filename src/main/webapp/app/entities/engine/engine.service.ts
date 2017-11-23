import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Engine } from './engine.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class EngineService {

    private resourceUrl = SERVER_API_URL + 'api/engines';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/engines';
    private typeAheadSearchUrl = 'api/_typeahead/engines';

    constructor(private http: Http) { }

    create(engine: Engine): Observable<Engine> {
        const copy = this.convert(engine);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(engine: Engine): Observable<Engine> {
        const copy = this.convert(engine);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Engine> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
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

    getStats(id: number): Observable<ResponseWrapper> {
        return this.http.get(`api/stats/engines/${id}`)
            .map((res: Response) => this.convertResponse(res));
    }

    getStatsYear(id: number, year: number): Observable<ResponseWrapper> {
        return this.http.get(`api/stats/engines/${id}/${year}`)
            .map((res: Response) => this.convertResponse(res));
    }

    getYears(id: number): Observable<ResponseWrapper> {
        return this.http.get(`api/stats/engines/${id}/years`)
            .map((res: Response) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Engine.
     */
    private convertItemFromServer(json: any): Engine {
        const entity: Engine = Object.assign(new Engine(), json);
        return entity;
    }

    /**
     * Convert a Engine to a JSON which can be sent to the server.
     */
    private convert(engine: Engine): Engine {
        const copy: Engine = Object.assign({}, engine);
        return copy;
    }
}
