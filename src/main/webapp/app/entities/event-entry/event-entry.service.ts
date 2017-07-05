import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { EventEntry } from './event-entry.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class EventEntryService {

    private resourceUrl = 'api/event-entries';
    private resourceSearchUrl = 'api/_search/event-entries';

    constructor(private http: Http) { }

    create(eventEntry: EventEntry): Observable<EventEntry> {
        const copy = this.convert(eventEntry);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(eventEntry: EventEntry): Observable<EventEntry> {
        const copy = this.convert(eventEntry);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<EventEntry> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
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
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(eventEntry: EventEntry): EventEntry {
        const copy: EventEntry = Object.assign({}, eventEntry);
        return copy;
    }
}
