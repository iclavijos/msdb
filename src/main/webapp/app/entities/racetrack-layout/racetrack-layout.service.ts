import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { RacetrackLayout } from './racetrack-layout.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class RacetrackLayoutService {

    private resourceUrl = SERVER_API_URL + 'api/racetrack-layouts';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/racetrack-layouts';

    constructor(private http: Http) { }

    create(racetrackLayout: RacetrackLayout): Observable<RacetrackLayout> {
        const copy = this.convert(racetrackLayout);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(racetrackLayout: RacetrackLayout): Observable<RacetrackLayout> {
        const copy = this.convert(racetrackLayout);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<RacetrackLayout> {
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

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to RacetrackLayout.
     */
    private convertItemFromServer(json: any): RacetrackLayout {
        const entity: RacetrackLayout = Object.assign(new RacetrackLayout(), json);
        return entity;
    }

    /**
     * Convert a RacetrackLayout to a JSON which can be sent to the server.
     */
    private convert(racetrackLayout: RacetrackLayout): RacetrackLayout {
        const copy: RacetrackLayout = Object.assign({}, racetrackLayout);
        return copy;
    }
}
