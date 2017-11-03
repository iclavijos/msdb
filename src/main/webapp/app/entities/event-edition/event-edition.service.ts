import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { ResponseWrapper, createRequestOption } from '../../shared';

import { EventEdition } from './event-edition.model';

import * as moment from 'moment-timezone';

@Injectable()
export class EventEditionService {

    private resourceUrl = SERVER_API_URL + 'api/event-editions';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/event-editions';
    private eventResourceUrl = 'api/events';

    constructor(private http: Http, private dateUtils: JhiDateUtils, private datePipe: DatePipe) { }

    create(eventEdition: EventEdition): Observable<EventEdition> {
        const copy = this.convert(eventEdition);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(eventEdition: EventEdition): Observable<EventEdition> {
        const copy = this.convert(eventEdition);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }
    
    copyEntries(idSource: number, idTarget: number): Observable<Response> {
        return this.http.post(`${this.resourceUrl}/${idTarget}/entries/${idSource}`, null);
    }

    find(id: number): Observable<EventEdition> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }
    
    findEventEditions(idEvent: number, req?: any): Observable<ResponseWrapper> {
        let options = createRequestOption(req);
        return this.http.get(`${this.eventResourceUrl}/${idEvent}/editions`, options).map((res: Response) => this.convertResponse(res));
    }
    
    findSessions(id: number, timeZone: string): Observable<ResponseWrapper> {
        return this.http.get(`${this.resourceUrl}/${id}/sessions`).map((res: Response) => {
            return this.transformDateTime(res, timeZone);
        });
    }
    
    findNonFPSessions(id: number, timeZone: string): Observable<ResponseWrapper> {
        return this.http.get(`${this.resourceUrl}/${id}/sessions/nonfp`).map((res: Response) => {
            if (timeZone) {
                return this.transformDateTime(res, timeZone);
            } else {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            }
        });
    }
    
    findWinners(id: number): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${id}/winners`).map((res: Response) => {
            return res.json();
        })
    }
    
    loadDriversPoints(id: number): Observable<ResponseWrapper> {
        return this.http.get(`${this.resourceUrl}/${id}/points`)
            .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
    }
    
    findCalendarEvents(startDate: Date, endDate: Date) {
        const dateFormat = 'yyyy-MM-dd';
        let fromDate = this.datePipe.transform(startDate, dateFormat);
        let toDate = this.datePipe.transform(endDate, dateFormat);
        return this.http.get(`${this.resourceUrl}/calendar/${fromDate}/${toDate}`)
            .map((res: Response) => {return res.json();});
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: any) => this.convertResponse(res))
        ;
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }
    
    typeAhead(query?: string): Observable<ResponseWrapper> {
        return this.http.get(`${this.resourceSearchUrl}?query=${query}`)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            jsonResponse[i].eventDate = new Date(
                    jsonResponse[i].eventDate[0], jsonResponse[i].eventDate[1] - 1, jsonResponse[i].eventDate[2]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }
    
    private transformDateTime(res: any, timeZone: string): any {
        let jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            jsonResponse[i].sessionStartTime = moment(jsonResponse[i].sessionStartTime * 1000).tz(timeZone);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    /**
     * Convert a returned JSON object to EventEdition.
     */
    private convertItemFromServer(json: any): EventEdition {
        const entity: EventEdition = Object.assign(new EventEdition(), json);
        entity.eventDate = new Date(
                entity.eventDate[0], entity.eventDate[1] - 1, entity.eventDate[2]);
        return entity;
    }

    /**
     * Convert a EventEdition to a JSON which can be sent to the server.
     */
    private convert(eventEdition: EventEdition): EventEdition {
        const copy: EventEdition = Object.assign({}, eventEdition);
        copy.eventDate = this.dateUtils
            .convertLocalDateToServer(eventEdition.eventDate);
        return copy;
    }
}
