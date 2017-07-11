import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { RacetrackLayout } from './racetrack-layout.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class RacetrackLayoutService {

    private resourceUrl = 'api/racetrack-layouts';
    private resourceSearchUrl = 'api/_search/layouts';

    constructor(private http: Http) { }

    create(racetrackLayout: RacetrackLayout): Observable<RacetrackLayout> {
        const copy = this.convert(racetrackLayout);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(racetrackLayout: RacetrackLayout): Observable<RacetrackLayout> {
        const copy = this.convert(racetrackLayout);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<RacetrackLayout> {
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

    searchLayout(query?: any): Observable<ResponseWrapper> {
        return this.http.get(`${this.resourceSearchUrl}?query=${query}`)
            .map((res: Response) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(racetrackLayout: RacetrackLayout): RacetrackLayout {
        const copy: RacetrackLayout = Object.assign({}, racetrackLayout);
        return copy;
    }
}
