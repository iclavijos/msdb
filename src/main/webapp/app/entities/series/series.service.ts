import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Series } from './series.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class SeriesService {

    private resourceUrl = SERVER_API_URL + 'api/series';
    private resourceEditionsUrl = SERVER_API_URL + 'api/series/${id}/editions';
    private resourceSearchUrl = 'api/_search/series';
    private resourceSearchEditionsUrl = 'api/_search/series/${id}/editions';
    
    private seriesCache: Series;
    private cachedId: number = 0;

    constructor(private http: Http) { }

    create(series: Series): Observable<Series> {
        const copy = this.convert(series);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(series: Series): Observable<Series> {
        const copy = this.convert(series);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Series> {
        if (id === this.cachedId) {
            return Observable.of(this.seriesCache);
        }
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            this.seriesCache = res.json();
            this.cachedId = id;
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
        	.map((res: Response) => this.convertResponse(res));
    }

    queryEditions(id: number, req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceEditionsUrl, options)
        	.map((res: Response) => this.convertResponse(res));
        ;
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
     * Convert a returned JSON object to Series.
     */
    private convertItemFromServer(json: any): Series {
        const entity: Series = Object.assign(new Series(), json);
        return entity;
    }

    /**
     * Convert a Series to a JSON which can be sent to the server.
     */
    private convert(series: Series): Series {
        const copy: Series = Object.assign({}, series);
        return copy;
    }

    searchEditions(id: number, req?: any): Observable<Response> {
        let options = createRequestOption(req);
        return this.http.get(this.resourceSearchEditionsUrl, options);
    }
}
