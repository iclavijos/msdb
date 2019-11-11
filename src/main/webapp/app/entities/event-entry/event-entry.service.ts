import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { EventEntry } from './event-entry.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class EventEntryService {

    private resourceUrl = SERVER_API_URL + 'api/event-entries';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/event-entries';

    constructor(private http: Http) { }

    create(eventEntry: EventEntry): Observable<EventEntry> {
        const copy = this.convert(eventEntry);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(eventEntry: EventEntry): Observable<EventEntry> {
        const copy = this.convert(eventEntry);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<EventEntry> {
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
     * Convert a returned JSON object to EventEntry.
     */
    private convertItemFromServer(json: any): EventEntry {
        const entity: EventEntry = Object.assign(new EventEntry(), json);
        return entity;
    }

    /**
     * Convert a EventEntry to a JSON which can be sent to the server.
     */
    private convert(eventEntry: EventEntry): EventEntry {
        const copy: EventEntry = Object.assign({}, eventEntry);
        return copy;
    }
}
