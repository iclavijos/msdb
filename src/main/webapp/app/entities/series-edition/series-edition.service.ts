import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { SeriesEdition } from './series-edition.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class SeriesEditionService {

    private resourceUrl = 'api/series-editions';
    private resourceSearchUrl = 'api/_search/series-editions';
    
    private seriesEdCache: SeriesEdition;
    private cachedId: number = 0;

    constructor(private http: Http) { }

    create(seriesEdition: SeriesEdition): Observable<SeriesEdition> {
        const copy = this.convert(seriesEdition);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(seriesEdition: SeriesEdition): Observable<SeriesEdition> {
        const copy = this.convert(seriesEdition);
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
    
    updateStandings(seriesId: number): Observable<Response> {
        return this.http.post(`${this.resourceUrl}/${seriesId}/standings`, null).map((res: Response) => {
            return res; 
         });
    }

    query(seriesId: number, req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(`api/series/${seriesId}/editions`, options)
            .map((res: any) => this.convertResponse(res));
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

    private convert(seriesEdition: SeriesEdition): SeriesEdition {
        const copy: SeriesEdition = Object.assign({}, seriesEdition);
        return copy;
    }
}
