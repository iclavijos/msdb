import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Driver } from './driver.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class DriverService {

    private resourceUrl = SERVER_API_URL + 'api/drivers';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/drivers';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(driver: Driver): Observable<Driver> {
        const copy = this.convert(driver);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(driver: Driver): Observable<Driver> {
        const copy = this.convert(driver);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Driver> {
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
     * Convert a returned JSON object to Driver.
     */
    private convertItemFromServer(json: any): Driver {
        const entity: Driver = Object.assign(new Driver(), json);
        entity.birthDate = this.dateUtils
            .convertLocalDateFromServer(json.birthDate);
        entity.deathDate = this.dateUtils
            .convertLocalDateFromServer(json.deathDate);
        return entity;
    }

    /**
     * Convert a Driver to a JSON which can be sent to the server.
     */
    private convert(driver: Driver): Driver {
        const copy: Driver = Object.assign({}, driver);
        copy.birthDate = this.dateUtils
            .convertLocalDateToServer(driver.birthDate);
        copy.deathDate = this.dateUtils
            .convertLocalDateToServer(driver.deathDate);
        return copy;
    }
}
