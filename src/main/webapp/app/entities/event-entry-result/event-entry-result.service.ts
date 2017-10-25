import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { EventEntryResult } from './event-entry-result.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class EventEntryResultService {

    private resourceUrl = 'api/event-entry-results';
    private resourceSearchUrl = 'api/_search/event-entry-results';

    constructor(private http: Http) { }

    create(eventEntryResult: EventEntryResult): Observable<EventEntryResult> {
        const copy = this.convert(eventEntryResult);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(eventEntryResult: EventEntryResult): Observable<EventEntryResult> {
        const copy = this.convert(eventEntryResult);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<EventEntryResult> {
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

    private convert(eventEntryResult: EventEntryResult): EventEntryResult {
        const copy: EventEntryResult = Object.assign({}, eventEntryResult);
        return copy;
    }
}
