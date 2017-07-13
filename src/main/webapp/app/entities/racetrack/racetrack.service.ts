import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Racetrack } from './racetrack.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class RacetrackService {

    private resourceUrl = 'api/racetracks';
    private resourceSearchUrl = 'api/_search/racetracks';

    constructor(private http: Http) { }

    create(racetrack: Racetrack): Observable<Racetrack> {
        const copy = this.convert(racetrack);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(racetrack: Racetrack): Observable<Racetrack> {
        const copy = this.convert(racetrack);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Racetrack> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    findLayouts(id: number): Observable<ResponseWrapper> {
        return this.http.get(`${this.resourceUrl}/${id}/layouts`)
            .map((res: Response) => this.convertResponse(res));
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

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(racetrack: Racetrack): Racetrack {
        const copy: Racetrack = Object.assign({}, racetrack);
        return copy;
    }
}
