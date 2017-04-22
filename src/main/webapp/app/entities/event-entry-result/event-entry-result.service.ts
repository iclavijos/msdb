import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { EventSession } from '../event-session';
import { EventEntryResult } from './event-entry-result.model';

@Injectable()
export class EventEntryResultService {

    constructor(private http: Http) { }

    create(eventEntryResult: EventEntryResult): Observable<EventEntryResult> {
        let copy: EventEntryResult = Object.assign({}, eventEntryResult);
        return this.http.post(`api/event-editions/${eventEntryResult.session.eventEdition.id}/event-sessions/${eventEntryResult.session.id}/results`, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(eventEntryResult: EventEntryResult): Observable<EventEntryResult> {
        let copy: EventEntryResult = Object.assign({}, eventEntryResult);
        return this.http.put(`api/event-editions/${eventEntryResult.session.eventEdition.id}/event-sessions/${eventEntryResult.session.id}/results`, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<EventEntryResult> {
        return this.http.get(`api/event-editions/event-sessions/results/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(session: EventSession): Observable<Response> {
        return this.http.get(`api/event-editions/${session.eventEdition.id}/event-sessions/${session.id}/results`)
            .map((res: any) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`api/event-editions/event-sessions/results/${id}`);
    }

    private convertResponse(res: any): any {
        let jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
//            if (jsonResponse[i].bestLapTime) {
//                jsonResponse[i].bestLapTime = this.convertTime(jsonResponse[i].bestLapTime);
//            }
//            if (jsonResponse[i].totalTime) {
//                jsonResponse[i].totalTime = this.convertTime(jsonResponse[i].totalTime, true);
//            }
//            if (jsonResponse[i].difference && jsonResponse[i].differenceType == 1) {
//                jsonResponse[i].difference = this.convertTime(jsonResponse[i].difference);
//            }
        }
        res._body = jsonResponse;
        return res;
    }
    
    private convertTime(timeMillis: number, handleHours?: boolean) {
        let millis = timeMillis % 10000;
        let seconds = Math.floor(timeMillis / 10000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        
        let result = '';
        
        let hours = Math.floor(minutes / 60);
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

    private createRequestOption(req?: any): BaseRequestOptions {
        let options: BaseRequestOptions = new BaseRequestOptions();
        if (req) {
            let params: URLSearchParams = new URLSearchParams();
            params.set('page', req.page);
            params.set('size', req.size);
            if (req.sort) {
                params.paramsMap.set('sort', req.sort);
            }
            params.set('query', req.query);

            options.search = params;
        }
        return options;
    }
}
