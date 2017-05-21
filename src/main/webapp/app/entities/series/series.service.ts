import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Series } from './series.model';
@Injectable()
export class SeriesService {

    private resourceUrl = 'api/series';
    private resourceEditionsUrl = 'api/series/${id}/editions';
    private resourceSearchUrl = 'api/_search/series';
    private resourceSearchEditionsUrl = 'api/_search/series/${id}/editions';
    
    private seriesCache: Series;
    private cachedId: number = 0;

    constructor(private http: Http) { }

    create(series: Series): Observable<Series> {
        let copy: Series = Object.assign({}, series);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(series: Series): Observable<Series> {
        let copy: Series = Object.assign({}, series);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Series> {
        if (id === this.cachedId) {
            return Observable.of(this.seriesCache);
        }
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            this.seriesCache = res.json();
            this.cachedId = id;
            return res.json();
        });
    }

    findEditions(id: number): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${id}/editions`);
    }

    query(req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
        ;
    }

    queryEditions(id: number, req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceEditionsUrl, options)
        ;
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options);
    }

    searchEditions(id: number, req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceSearchEditionsUrl, options);
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
