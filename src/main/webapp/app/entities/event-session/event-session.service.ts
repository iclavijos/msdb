import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEventSession } from 'app/shared/model/event-session.model';

import { SessionType } from 'app/shared/enumerations/sessionType.enum';

import { IDriverAverages } from 'app/shared/model/driver-averages.model';
import { ILapPositions } from 'app/shared/model/lap-positions.model';

type EntityResponseType = HttpResponse<IEventSession>;
type EntityArrayResponseType = HttpResponse<IEventSession[]>;

import * as moment from 'moment';
import 'moment-timezone';

@Injectable({ providedIn: 'root' })
export class EventSessionService {
  public resourceUrl = SERVER_API_URL + 'api/event-editions/event-sessions';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/event-sessions';
  public resourceEventEditionUrl = SERVER_API_URL + 'api/event-editions';

  private sessionTypes = SessionType;

  constructor(protected http: HttpClient) {}

  create(eventSession: IEventSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventSession);
    return this.http
      .post<IEventSession>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(eventSession: IEventSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventSession);
    return this.http
      .put<IEventSession>(this.resourceUrl, copy, { observe: 'response' })
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

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEventSession[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(eventSession: IEventSession): IEventSession {
    const copy: IEventSession = Object.assign({}, eventSession, {
      sessionStartTime:
        eventSession.sessionStartTime != null && eventSession.sessionStartTime.isValid() ? eventSession.sessionStartTime.unix() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.sessionStartTime = res.body.sessionStartTime != null ? moment(res.body.sessionStartTime) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((eventSession: IEventSession) => {
        eventSession.sessionStartTime = eventSession.sessionStartTime != null ? moment(eventSession.sessionStartTime) : null;
      });
    }
    return res;
  }

  findSessions(id: number, timeZone: string): Observable<EntityArrayResponseType> {
    return this.http
      .get<IEventSession[]>(`${this.resourceEventEditionUrl}/${id}/sessions`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.transformDateTime(res, timeZone)));
  }

  findSessionDriverNames(id: number): Observable<string[]> {
    return this.http.get<any>(`${this.resourceUrl}/${id}/laps/drivers`);
  }

  findSessionAverages(id: number): Observable<IDriverAverages[]> {
    return this.http.get<IDriverAverages[]>(`${this.resourceUrl}/${id}/laps/averages`);
  }

  findFastestTime(id: number): Observable<number> {
    return this.http.get<number>(`${this.resourceUrl}/${id}/fastestLap`);
  }

  findMaxLaps(id: number): Observable<number> {
    return this.http.get<number>(`${this.resourceUrl}/${id}/maxLaps`);
  }

  findRaceChartData(id: number): Observable<ILapPositions[]> {
    return this.http.get<ILapPositions[]>(`${this.resourceUrl}/${id}/positions`);
  }

  private transformDateTime(res: EntityArrayResponseType, timeZone: string): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((eventSession: IEventSession) => {
        eventSession.sessionType = this.sessionTypes[this.sessionTypes[eventSession.sessionTypeValue]];
        eventSession.sessionStartTime =
          eventSession.sessionStartTime != null ? moment(Number(eventSession.sessionStartTime) * 1000).tz(timeZone) : null;
      });
    }
    return res;
  }
}
