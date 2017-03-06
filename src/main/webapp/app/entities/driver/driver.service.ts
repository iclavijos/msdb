import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Driver } from './driver.model';
import { DateUtils } from 'ng-jhipster';
@Injectable()
export class DriverService {

    private resourceUrl = 'api/drivers';
    private resourceSearchUrl = 'api/_search/drivers';
    private resourceTypeAheadUrl = 'api/_typeahead/drivers';

    constructor(private http: Http, private dateUtils: DateUtils) { }

    create(driver: Driver): Observable<Driver> {
        let copy: Driver = Object.assign({}, driver);
        copy.birthDate = this.dateUtils
            .convertLocalDateToServer(driver.birthDate);
        copy.deathDate = this.dateUtils
            .convertLocalDateToServer(driver.deathDate);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(driver: Driver): Observable<Driver> {
        let copy: Driver = Object.assign({}, driver);
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
            let jsonResponse = res.json();
            jsonResponse.birthDate = new Date(jsonResponse.birthDate[0], jsonResponse.birthDate[1] - 1, jsonResponse.birthDate[2]);
            if (jsonResponse.deathDate) {
                jsonResponse.deathDate = new Date(jsonResponse.deathDate[0], jsonResponse.deathDate[1] - 1, jsonResponse.deathDate[2]);
            }
            return jsonResponse;
        });
    }

    query(req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: any) => this.convertResponse(res))
        ;
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res))
        ;
    }
    
    typeahead(req): Observable<Response> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('query', req);
        
        return this.http.get(this.resourceTypeAheadUrl, {
                search: params
            }).map((res: any) => res)
        ;
    }

    private convertResponse(res: any): any {
        let jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            jsonResponse[i].birthDate = new Date(jsonResponse[i].birthDate[0], jsonResponse[i].birthDate[1] - 1, jsonResponse[i].birthDate[2]);
            if (jsonResponse[i].deathDate) {
                jsonResponse[i].deathDate = new Date(jsonResponse[i].deathDate[0], jsonResponse[i].deathDate[1] - 1, jsonResponse[i].deathDate[2]);
            }
        }
        res._body = jsonResponse;
        return res;
    }

    private createRequestOption(req?: any): BaseRequestOptions {
        let options: BaseRequestOptions = new BaseRequestOptions();
        if (req) {
            let params: URLSearchParams = new URLSearchParams();
            params.set('page', req.page);
            params.set('size', req.size);
            if (req.sort) {
                params.paramsMap.set('sort', req.sort);
            }
            params.set('query', req.query);

            options.search = params;
        }
        return options;
    }
}
