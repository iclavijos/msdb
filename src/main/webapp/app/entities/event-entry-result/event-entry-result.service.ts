import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEventEntryResult } from 'app/shared/model/event-entry-result.model';

type EntityResponseType = HttpResponse<IEventEntryResult>;
type EntityArrayResponseType = HttpResponse<IEventEntryResult[]>;

@Injectable({ providedIn: 'root' })
export class EventEntryResultService {
  public resourceUrl = SERVER_API_URL + 'api/event-entry-results';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/event-entry-results';

  constructor(protected http: HttpClient) {}

  create(eventEntryResult: IEventEntryResult, sessionId: number): Observable<EntityResponseType> {
    const copy: IEventEntryResult = Object.assign({}, eventEntryResult);
    copy.session = null;
    return this.http.post<IEventEntryResult>(`api/event-editions/event-sessions/${sessionId}/results`, copy, { observe: 'response' });
  }

  update(eventEntryResult: IEventEntryResult, sessionId: number): Observable<EntityResponseType> {
    const copy: IEventEntryResult = Object.assign({}, eventEntryResult);
    copy.session = null;
    return this.http.put<IEventEntryResult>(`api/event-editions/event-sessions/${sessionId}/results`, copy, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEventEntryResult>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(eventEditionId: number, eventSessionId: number): Observable<EntityArrayResponseType> {
    return this.http.get<IEventEntryResult[]>(`api/event-editions/${eventEditionId}/event-sessions/${eventSessionId}/results`, {
      observe: 'response'
    });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEntryResult[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  processSessionResults(id: number): Observable<any> {
    return this.http.put(`api/event-editions/event-sessions/${id}/process-results`, null);
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
        result += '0' + String(minutes) + "'";
      } else if (minutes < 10) {
        result += String(minutes) + "'";
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
}
