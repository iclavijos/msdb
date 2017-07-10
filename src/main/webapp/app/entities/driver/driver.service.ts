import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { Driver } from './driver.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class DriverService {

    private resourceUrl = 'api/drivers';
    private resourceSearchUrl = 'api/_search/drivers';
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
        let params: URLSearchParams = new URLSearchParams();
        params.set('query', req);

        return this.http.get(this.resourceTypeAheadUrl, {
                search: params
            }).map((res: any) => res)
        ;
    }

    private convertResponse(res: Response): ResponseWrapper {
        let jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            if (jsonResponse[i].birthDate) {
                jsonResponse[i].birthDate = new Date(
                        jsonResponse[i].birthDate[0], jsonResponse[i].birthDate[1] - 1, jsonResponse[i].birthDate[2]);
            }
            if (jsonResponse[i].deathDate) {
                jsonResponse[i].deathDate = new Date(
                        jsonResponse[i].deathDate[0], jsonResponse[i].deathDate[1] - 1, jsonResponse[i].deathDate[2]);
            }
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.birthDate = this.dateUtils
            .convertLocalDateFromServer(entity.birthDate);
        entity.deathDate = this.dateUtils
            .convertLocalDateFromServer(entity.deathDate);
    }

    private convert(driver: Driver): Driver {
        const copy: Driver = Object.assign({}, driver);
        copy.birthDate = this.dateUtils
            .convertLocalDateToServer(driver.birthDate);
        copy.deathDate = this.dateUtils
            .convertLocalDateToServer(driver.deathDate);
        return copy;
    }
}
