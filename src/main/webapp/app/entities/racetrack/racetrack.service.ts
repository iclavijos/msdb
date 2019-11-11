import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Racetrack } from './racetrack.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class RacetrackService {

    private resourceUrl = SERVER_API_URL + 'api/racetracks';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/racetracks';

    constructor(private http: Http) { }

    create(racetrack: Racetrack): Observable<Racetrack> {
        const copy = this.convert(racetrack);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(racetrack: Racetrack): Observable<Racetrack> {
        const copy = this.convert(racetrack);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Racetrack> {
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
     * Convert a returned JSON object to Racetrack.
     */
    private convertItemFromServer(json: any): Racetrack {
        const entity: Racetrack = Object.assign(new Racetrack(), json);
        return entity;
    }

    /**
     * Convert a Racetrack to a JSON which can be sent to the server.
     */
    private convert(racetrack: Racetrack): Racetrack {
        const copy: Racetrack = Object.assign({}, racetrack);
        return copy;
    }
}
