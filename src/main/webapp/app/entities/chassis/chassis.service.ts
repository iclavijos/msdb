import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Chassis } from './chassis.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ChassisService {

    private resourceUrl = SERVER_API_URL + 'api/chassis';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/chassis';

    constructor(private http: Http) { }

    create(chassis: Chassis): Observable<Chassis> {
        const copy = this.convert(chassis);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(chassis: Chassis): Observable<Chassis> {
        const copy = this.convert(chassis);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Chassis> {
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
     * Convert a returned JSON object to Chassis.
     */
    private convertItemFromServer(json: any): Chassis {
        const entity: Chassis = Object.assign(new Chassis(), json);
        return entity;
    }

    /**
     * Convert a Chassis to a JSON which can be sent to the server.
     */
    private convert(chassis: Chassis): Chassis {
        const copy: Chassis = Object.assign({}, chassis);
        return copy;
    }
}
