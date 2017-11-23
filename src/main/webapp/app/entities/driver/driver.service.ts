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
    private resourceTypeAheadUrl = 'api/_typeahead/drivers';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(driver: Driver): Observable<Driver> {
        const copy = this.convert(driver);
        copy.birthDate = this.dateUtils
            .convertLocalDateToServer(driver.birthDate);
        copy.deathDate = this.dateUtils
            .convertLocalDateToServer(driver.deathDate);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(driver: Driver): Observable<Driver> {
        const copy = this.convert(driver);
        copy.birthDate = this.dateUtils
            .convertLocalDateToServer(driver.birthDate);
        copy.deathDate = this.dateUtils
            .convertLocalDateToServer(driver.deathDate);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Driver> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            if (jsonResponse.birthDate) {
                jsonResponse.birthDate = new Date(jsonResponse.birthDate[0], jsonResponse.birthDate[1] - 1, jsonResponse.birthDate[2]);
            }
            if (jsonResponse.deathDate) {
                jsonResponse.deathDate = new Date(jsonResponse.deathDate[0], jsonResponse.deathDate[1] - 1, jsonResponse.deathDate[2]);
            }
            return jsonResponse;
        });
    }

    getStats(id: number): Observable<ResponseWrapper> {
        return this.http.get(`api/stats/drivers/${id}`)
            .map((res: Response) => this.convertResponse(res));
    }

    getStatsYear(id: number, year: number): Observable<ResponseWrapper> {
        return this.http.get(`api/stats/drivers/${id}/${year}`)
            .map((res: Response) => this.convertResponse(res));
    }

    getYears(id: number): Observable<ResponseWrapper> {
        return this.http.get(`api/stats/drivers/${id}/years`)
            .map((res: Response) => this.convertResponse(res));
    }

    searchCountries(query?: any): Observable<ResponseWrapper> {
        return this.http.get('api/_typeahead/countries?query=' + query)
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

    typeahead(req): Observable<ResponseWrapper> {
        return this.http.get(`${this.resourceSearchUrl}?query=${req}`).map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            if (jsonResponse[i].birthDate) {
                jsonResponse[i].birthDate = new Date(
                        jsonResponse[i].birthDate[0], jsonResponse[i].birthDate[1] - 1, jsonResponse[i].birthDate[2]);
            }
            if (jsonResponse[i].deathDate) {
                jsonResponse[i].deathDate = new Date(
                        jsonResponse[i].deathDate[0], jsonResponse[i].deathDate[1] - 1, jsonResponse[i].deathDate[2]);
            }
            result.push(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
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
