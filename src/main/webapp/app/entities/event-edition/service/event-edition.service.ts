import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateTime } from 'luxon';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IEventEdition, getEventEditionIdentifier, EventsSeriesNavigation } from '../event-edition.model';
import { IDriverLap } from 'app/shared/model/driver-lap.model';

export type EntityResponseType = HttpResponse<IEventEdition>;
export type EntityArrayResponseType = HttpResponse<IEventEdition[]>;

@Injectable({ providedIn: 'root' })
export class EventEditionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-editions');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/event-editions');
  protected eventResourceUrl = this.applicationConfigService.getEndpointFor('api/events');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService) {}

  create(eventEdition: IEventEdition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventEdition);
    return this.http
      .post<IEventEdition>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(eventEdition: IEventEdition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventEdition);
    return this.http
      .put<IEventEdition>(`${this.resourceUrl}/${getEventEditionIdentifier(eventEdition) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(eventEdition: IEventEdition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventEdition);
    return this.http
      .patch<IEventEdition>(`${this.resourceUrl}/${getEventEditionIdentifier(eventEdition) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEventEdition>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEventEdition[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEventEdition[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

 findEventEditions(idEvent: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEdition[]>(`${this.eventResourceUrl}/${idEvent}/editions`, { params: options, observe: 'response' });
  }

  findPrevNextInSeries(id: number): Observable<EventsSeriesNavigation[]> {
    return this.http.get<EventsSeriesNavigation[]>(`${this.resourceUrl}/${id}/prevNextInSeries`);
  }

  findDriversBestTimes(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourceUrl}/${eventId}/bestTimes`);
  }

  hasLapsData(eventId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.resourceUrl}/${eventId}/laps`);
  }

  loadLapTimes(eventId: number, raceNumber: string): Observable<IDriverLap[]> {
    return this.http.get<IDriverLap[]>(`${this.resourceUrl}/${eventId}/laps/${raceNumber}`);
  }

  findCalendarEvents(startDate: Date, endDate: Date): Observable<any[]> {
    const dateFormat = 'yyyy-MM-dd';
    const fromDate = DateTime.fromJSDate(startDate).toFormat(dateFormat);
    const toDate = DateTime.fromJSDate(endDate).toFormat(dateFormat);
    return this.http.get<any[]>(`${this.resourceUrl}/calendar/${fromDate}/${toDate}`);
  }

  rescheduleEvent(eventId: number, newDate: DateTime): Observable<HttpResponse<{}>> {
    return this.http.put<HttpResponse<{}>>(`${this.resourceUrl}/${eventId}/reschedule`, newDate, { observe: 'response' });
  }

  loadDriversPoints(eventId: number, seriesId?: number): Observable<HttpResponse<{}>> {
    let endpoint: string;
    if (seriesId !== undefined) {
      endpoint = `${this.resourceUrl}/${seriesId}/${eventId}/points/drivers`;
    } else {
      endpoint = `${this.resourceUrl}/${eventId}/points/drivers`;
    }
    return this.http.get<HttpResponse<{}>>(endpoint);
  }

  loadTeamsPoints(eventId: number, seriesId?: number): Observable<HttpResponse<{}>> {
    let endpoint: string;
    if (seriesId !== undefined) {
      endpoint = `${this.resourceUrl}/${seriesId}/${eventId}/points/teams`;
    } else {
      endpoint = `${this.resourceUrl}/${eventId}/points/teams`;
    }
    return this.http.get<HttpResponse<{}>>(endpoint);
  }

  copyEntries(idSource: number, idTarget: number): Observable<HttpResponse<{}>> {
    return this.http.post<HttpResponse<{}>>(`${this.resourceUrl}/${idTarget}/entries/${idSource}`, null);
  }

  clone(eventEditionId: number, newPeriod: string): Observable<HttpResponse<{}>> {
    return this.http.post<HttpResponse<{}>>(`${this.resourceUrl}/${eventEditionId}/clone`, newPeriod);
  }

  protected convertDateFromClient(eventEdition: IEventEdition): IEventEdition {
    return Object.assign({}, eventEdition, {
      eventDate: eventEdition.eventDate?.isValid ? eventEdition.eventDate.toFormat(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      const eventDateCopy = Object.assign([], res.body.eventDate);
      res.body.eventDate = res.body.eventDate ? DateTime.fromObject({
        year: eventDateCopy[0],
        month: eventDateCopy[1],
        day: eventDateCopy[2]
      }) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((eventEdition: IEventEdition) => {
        const eventDateCopy = Object.assign([], eventEdition.eventDate);
        eventEdition.eventDate = eventEdition.eventDate ? DateTime.fromObject({
          year: eventDateCopy[0],
          month: eventDateCopy[1],
          day: eventDateCopy[2]
        }) : undefined;
      });
    }
    return res;
  }
}
