import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { EventSession } from './event-session.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class EventSessionService {

    private resourceUrl = SERVER_API_URL + 'api/event-sessions';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/event-sessions';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(eventSession: EventSession): Observable<EventSession> {
        const copy = this.convert(eventSession);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(eventSession: EventSession): Observable<EventSession> {
        const copy = this.convert(eventSession);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<EventSession> {
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
     * Convert a returned JSON object to EventSession.
     */
    private convertItemFromServer(json: any): EventSession {
        const entity: EventSession = Object.assign(new EventSession(), json);
        entity.sessionStartTime = this.dateUtils
            .convertDateTimeFromServer(json.sessionStartTime);
        return entity;
    }

    /**
     * Convert a EventSession to a JSON which can be sent to the server.
     */
    private convert(eventSession: EventSession): EventSession {
        const copy: EventSession = Object.assign({}, eventSession);

        copy.sessionStartTime = this.dateUtils.toDate(eventSession.sessionStartTime);
        return copy;
    }
}
