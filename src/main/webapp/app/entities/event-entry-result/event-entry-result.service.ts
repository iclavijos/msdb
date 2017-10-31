import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { EventEntryResult } from './event-entry-result.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class EventEntryResultService {

    private resourceUrl = SERVER_API_URL + 'api/event-entry-results';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/event-entry-results';

    constructor(private http: Http) { }

    create(eventEntryResult: EventEntryResult): Observable<EventEntryResult> {
        const copy = this.convert(eventEntryResult);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(eventEntryResult: EventEntryResult): Observable<EventEntryResult> {
        const copy = this.convert(eventEntryResult);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<EventEntryResult> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
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
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to EventEntryResult.
     */
    private convertItemFromServer(json: any): EventEntryResult {
        const entity: EventEntryResult = Object.assign(new EventEntryResult(), json);
        return entity;
    }

    /**
     * Convert a EventEntryResult to a JSON which can be sent to the server.
     */
    private convert(eventEntryResult: EventEntryResult): EventEntryResult {
        const copy: EventEntryResult = Object.assign({}, eventEntryResult);
        return copy;
    }
}
