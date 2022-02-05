import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateTime } from 'luxon';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Search } from 'app/core/request/request.model';
import { IEventSession, getEventSessionIdentifier } from '../event-session.model';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';
import { IDriverAverages } from 'app/shared/model/driver-averages.model';
import { ILapPositions } from 'app/shared/model/lap-positions.model';

export type EntityResponseType = HttpResponse<IEventSession>;
export type EntityArrayResponseType = HttpResponse<IEventSession[]>;

@Injectable({ providedIn: 'root' })
export class EventSessionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-editions/event-sessions');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/event-sessions');
  protected resourceEventEditionUrl = this.applicationConfigService.getEndpointFor('api/event-editions');
  protected resourceGeoLocationUrl = this.applicationConfigService.getEndpointFor('api/timezone');

  private sessionTypes = SessionType;

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

  findSessions(id: number, timeZone: string): Observable<EntityArrayResponseType> {
    return this.http
      .get<IEventSession[]>(`${this.resourceEventEditionUrl}/${id}/sessions`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.transformDateTime(res, timeZone)));
  }

  findSessionDriverNames(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.resourceUrl}/${id}/laps/drivers`);
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

  findDriversPerformance(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourceUrl}/${id}/driversPerformance`);
  }

  hasLapsData(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.resourceEventEditionUrl}/session/${id}/laps`);
  }

  findTimezone(location: string): Observable<string> {
    return this.http.get(`${this.resourceGeoLocationUrl}/${location}`, { responseType: 'text' });
  }

  protected convertDateFromClient(eventSession: IEventSession): IEventSession {
    const tmp = Object.assign({}, eventSession.eventEdition, {
      eventDate: [
        eventSession.eventEdition!.eventDate!.year,
        eventSession.eventEdition!.eventDate!.month,
        eventSession.eventEdition!.eventDate!.day,
      ]
    });
    const result = Object.assign({}, eventSession, {
      sessionStartTime: eventSession.sessionStartTime?.isValid ? eventSession.sessionStartTime.toSeconds() : undefined,
      eventEdition: tmp
    });

    return result;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      const startTimeCopy = Object.assign([], res.body.sessionStartTime);
      res.body.sessionStartTime = res.body.sessionStartTime ? DateTime.fromObject({
        year: startTimeCopy[0],
        month: startTimeCopy[1],
        day: startTimeCopy[2]
      }) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((eventSession: IEventSession) => {
        const startTimeCopy = Object.assign([], eventSession.sessionStartTime);
        eventSession.sessionStartTime = eventSession.sessionStartTime ? DateTime.fromObject({
          year: startTimeCopy[0],
          month: startTimeCopy[1],
          day: startTimeCopy[2]
        }) : undefined;
      });
    }
    return res;
  }

  private transformDateTime(res: EntityArrayResponseType, timeZone: string): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((eventSession: IEventSession) => {
        const tzToApply = timeZone ? timeZone : eventSession.locationTimeZone;
        eventSession.sessionStartTime = DateTime.fromSeconds(eventSession.sessionStartTimeDate!, { zone: tzToApply});
      });
    }
    return res;
  }
}
