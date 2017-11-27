import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { EventSession } from '../event-session';
import { EventEntryResult } from './event-entry-result.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class EventEntryResultService {

    private resourceUrl = SERVER_API_URL + 'api/event-entry-results';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/event-entry-results';

    constructor(private http: Http) { }

    create(eventEntryResult: EventEntryResult): Observable<EventEntryResult> {
        const copy: EventEntryResult = Object.assign({}, eventEntryResult);
        return this.http.post(`api/event-editions/${eventEntryResult.session.eventEdition.id}/event-sessions/${eventEntryResult.session.id}/results`, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(eventEntryResult: EventEntryResult): Observable<EventEntryResult> {
        const copy = this.convert(eventEntryResult);
        return this.http.put(`api/event-editions/event-sessions/results`, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<EventEntryResult> {
        return this.http.get(`api/event-editions/event-sessions/results/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(session: EventSession): Observable<ResponseWrapper> {
        return this.http.get(`api/event-editions/${session.eventEdition.id}/event-sessions/${session.id}/results`)
            .map((res: any) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`api/event-editions/event-sessions/results/${id}`);
    }

    processSessionResults(id: number): Observable<Response> {
        return this.http.put(`api/event-editions/event-sessions/${id}/process-results`, null);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    private convertTime(timeMillis: number, handleHours?: boolean) {
        const millis = timeMillis % 10000;
        let seconds = Math.floor(timeMillis / 10000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;

        let result = '';

        const hours = Math.floor(minutes / 60);
        if (handleHours) {
            if (hours > 0) {
                minutes = minutes % 60;
                result = String(hours) + 'h';
            }
        }

        if (minutes > 0) {
            if (hours > 0 && minutes < 10) {
                result += '0' + String(minutes) + '\'';
            } else if (minutes < 10) {
                result += String(minutes) + '\'';
            }
        }

        if (seconds < 10) {
            result += '0' + String(seconds) + '".';
        } else {
            result += String(seconds) + '".';
        }
        if (millis < 1000) {
            result += '0';
        }
        result += String(millis);
        return result;
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
