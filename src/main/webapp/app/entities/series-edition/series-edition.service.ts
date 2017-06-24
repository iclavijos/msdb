import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { SeriesEdition } from './series-edition.model';

@Injectable()
export class SeriesEditionService {

    private resourceUrl = 'api/series-editions';
    private resourceSearchUrl = 'api/_search/series-editions';
    
    private seriesEdCache: SeriesEdition;
    private cachedId: number = 0;

    constructor(private http: Http) { }

    create(seriesEdition: SeriesEdition): Observable<SeriesEdition> {
        let copy: SeriesEdition = Object.assign({}, seriesEdition);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(seriesEdition: SeriesEdition): Observable<SeriesEdition> {
        let copy: SeriesEdition = Object.assign({}, seriesEdition);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<SeriesEdition> {
        if (id === this.cachedId) {
            return Observable.of(this.seriesEdCache);
        }
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            this.seriesEdCache = res.json();
            this.cachedId = id;
            return res.json();
        });
    }
    
    findEvents(id: number): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${id}/events`).map((res: Response) => {
            return res;
        });
    }
    
    findDriversStandings(id: number): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${id}/standings/drivers`).map((res: Response) => {
            return res;
        });
    }
    
    findTeamsStandings(id: number): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${id}/standings/teams`).map((res: Response) => {
            return res;
        });
    }
    
    addEventToSeries(seriesId: number, eventId: number, racesData: any): Observable<Response> {
        return this.http.post(`${this.resourceUrl}/${seriesId}/events/${eventId}`, racesData).map((res: Response) => {
           return res; 
        });
    }
    
    removeEventFromSeries(seriesId: number, eventId: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${seriesId}/events/${eventId}`).map((res: Response) => {
           return res; 
        });
    }

    query(seriesId: number, req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(`api/series/${seriesId}/editions`, options);
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
        ;
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
