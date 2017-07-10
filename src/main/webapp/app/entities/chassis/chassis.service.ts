import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Chassis } from './chassis.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ChassisService {

    private resourceUrl = 'api/chassis';
    private resourceSearchUrl = 'api/_search/chassis';

    constructor(private http: Http) { }

    create(chassis: Chassis): Observable<Chassis> {
        const copy = this.convert(chassis);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(chassis: Chassis): Observable<Chassis> {
        const copy = this.convert(chassis);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Chassis> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }
    
    searchChassis(query?: any): Observable<ResponseWrapper> {
        return this.http.get('api/_typeahead/chassis?query=' + query)
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

    private convert(chassis: Chassis): Chassis {
        const copy: Chassis = Object.assign({}, chassis);
        return copy;
    }
}
