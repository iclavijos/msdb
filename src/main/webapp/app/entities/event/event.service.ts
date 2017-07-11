import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Event } from './event.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class EventService {

    private resourceUrl = 'api/events';
    private resourceSearchUrl = 'api/_search/events';

    constructor(private http: Http) { }

    create(event: Event): Observable<Event> {
        const copy = this.convert(event);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(event: Event): Observable<Event> {
        const copy = this.convert(event);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Event> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }
    
    findEventEditionIds(idEvent: number): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${idEvent}/editionIds`);
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
	
    searchTypeahead(query?: any): Observable<ResponseWrapper> {
        return this.http.get('api/_typeahead/events?query=' + query)
            .map((res: Response) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(event: Event): Event {
        const copy: Event = Object.assign({}, event);
        return copy;
    }
}
