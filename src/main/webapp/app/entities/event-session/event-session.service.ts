import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { EventSession } from './event-session.model';
import { JhiDateUtils } from 'ng-jhipster';

import { ResponseWrapper, createRequestOption } from '../../shared';

import * as moment from 'moment-timezone';

@Injectable()
export class EventSessionService {

    private resourceUrl = 'api/event-editions/event-sessions';
    private resourceSearchUrl = 'api/_search/event-sessions';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(eventSession: EventSession): Observable<EventSession> {
       const copy = this.convert(eventSession);
        
        copy.sessionStartTime = moment(eventSession.sessionStartTime).tz(eventSession.eventEdition.trackLayout.racetrack.timeZone);
        copy.sessionStartTime.hours(copy.sessionStartTime.toDate().getHours());
        copy.sessionStartTime.minutes(copy.sessionStartTime.toDate().getMinutes());
        copy.sessionStartTime.date(moment(eventSession.sessionStartTime).date());
        copy.sessionStartTime.month(moment(eventSession.sessionStartTime).month());

        return this.http.post(
                `api/event-editions/${copy.eventEdition.id}/sessions`, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(eventSession: EventSession): Observable<EventSession> {
        const copy = this.convert(eventSession);

        copy.sessionStartTime = moment(eventSession.sessionStartTime).tz(eventSession.eventEdition.trackLayout.racetrack.timeZone);
        copy.sessionStartTime.hours(copy.sessionStartTime.toDate().getHours());
        copy.sessionStartTime.minutes(copy.sessionStartTime.toDate().getMinutes());
        copy.sessionStartTime.date(moment(eventSession.sessionStartTime).date());
        copy.sessionStartTime.month(moment(eventSession.sessionStartTime).month());
        
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<EventSession> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            let jsonResponse = res.json();
            jsonResponse.sessionStartTime = moment(jsonResponse.sessionStartTime).tz(jsonResponse.eventEdition.trackLayout.racetrack.timeZone);
            return jsonResponse;
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
        for (let i = 0; i < jsonResponse.length; i++) {
            jsonResponse[i].sessionStartTime = moment(jsonResponse[i].sessionStartTime)
                .tz(jsonResponse[i].eventEdition.trackLayout.racetrack.timeZone);;
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.sessionStartTime = this.dateUtils
            .convertDateTimeFromServer(entity.sessionStartTime);
    }

    private convert(eventSession: EventSession): EventSession {
        const copy: EventSession = Object.assign({}, eventSession);

        copy.sessionStartTime = this.dateUtils.toDate(eventSession.sessionStartTime);
        return copy;
    }
}
