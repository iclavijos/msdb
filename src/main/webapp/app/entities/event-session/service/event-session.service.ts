import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Search } from 'app/core/request/request.model';
import { IEventSession, getEventSessionIdentifier } from '../event-session.model';

export type EntityResponseType = HttpResponse<IEventSession>;
export type EntityArrayResponseType = HttpResponse<IEventSession[]>;

@Injectable({ providedIn: 'root' })
export class EventSessionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-sessions');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/event-sessions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventSession: IEventSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventSession);
    return this.http
      .post<IEventSession>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(eventSession: IEventSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventSession);
    return this.http
      .put<IEventSession>(`${this.resourceUrl}/${getEventSessionIdentifier(eventSession) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(eventSession: IEventSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventSession);
    return this.http
      .patch<IEventSession>(`${this.resourceUrl}/${getEventSessionIdentifier(eventSession) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEventSession>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEventSession[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEventSession[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addEventSessionToCollectionIfMissing(
    eventSessionCollection: IEventSession[],
    ...eventSessionsToCheck: (IEventSession | null | undefined)[]
  ): IEventSession[] {
    const eventSessions: IEventSession[] = eventSessionsToCheck.filter(isPresent);
    if (eventSessions.length > 0) {
      const eventSessionCollectionIdentifiers = eventSessionCollection.map(
        eventSessionItem => getEventSessionIdentifier(eventSessionItem)!
      );
      const eventSessionsToAdd = eventSessions.filter(eventSessionItem => {
        const eventSessionIdentifier = getEventSessionIdentifier(eventSessionItem);
        if (eventSessionIdentifier == null || eventSessionCollectionIdentifiers.includes(eventSessionIdentifier)) {
          return false;
        }
        eventSessionCollectionIdentifiers.push(eventSessionIdentifier);
        return true;
      });
      return [...eventSessionsToAdd, ...eventSessionCollection];
    }
    return eventSessionCollection;
  }

  protected convertDateFromClient(eventSession: IEventSession): IEventSession {
    return Object.assign({}, eventSession, {
      sessionStartTime: eventSession.sessionStartTime?.isValid() ? eventSession.sessionStartTime.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.sessionStartTime = res.body.sessionStartTime ? dayjs(res.body.sessionStartTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((eventSession: IEventSession) => {
        eventSession.sessionStartTime = eventSession.sessionStartTime ? dayjs(eventSession.sessionStartTime) : undefined;
      });
    }
    return res;
  }
}
