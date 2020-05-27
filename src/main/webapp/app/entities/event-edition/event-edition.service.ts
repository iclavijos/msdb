import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEventEdition } from 'app/shared/model/event-edition.model';

type EntityResponseType = HttpResponse<IEventEdition>;
type EntityArrayResponseType = HttpResponse<IEventEdition[]>;

import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class EventEditionService {
  public resourceUrl = SERVER_API_URL + 'api/event-editions';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/event-editions';
  public eventResourceUrl = 'api/events';

  constructor(protected http: HttpClient, protected datePipe: DatePipe) {}

  create(event: IEventEdition): Observable<EntityResponseType> {
    return this.http.post<IEventEdition>(this.resourceUrl, event, { observe: 'response' });
  }

  update(event: IEventEdition): Observable<EntityResponseType> {
    return this.http.put<IEventEdition>(this.resourceUrl, event, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEventEdition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEdition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEdition[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  findEventEditions(idEvent: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEdition[]>(`${this.eventResourceUrl}/${idEvent}/editions`, { params: options, observe: 'response' });
  }

  findPrevNextInSeries(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourceUrl}/${id}/prevNextInSeries`);
  }

  findDriversBestTimes(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourceUrl}/${eventId}/bestTimes`);
  }

  hasLapsData(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourceUrl}/${eventId}/laps`);
  }

  findCalendarEvents(startDate: Date, endDate: Date) {
    const dateFormat = 'yyyy-MM-dd';
    const fromDate = this.datePipe.transform(startDate, dateFormat);
    const toDate = this.datePipe.transform(endDate, dateFormat);
    return this.http.get<any[]>(`${this.resourceUrl}/calendar/${fromDate}/${toDate}`);
  }

  rescheduleEvent(eventId: number, newDate: moment.Moment) {
    return this.http.put<IEventEdition>(`${this.resourceUrl}/${eventId}/reschedule`, newDate, { observe: 'response' });
  }
}
