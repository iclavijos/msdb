import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateTime } from 'luxon';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IRacetrack, getRacetrackIdentifier } from '../racetrack.model';
import { IRacetrackLayout } from '../../racetrack-layout/racetrack-layout.model';
import { EventEditionAndWinners } from 'app/entities/event-edition/event-edition.model';

export type EntityResponseType = HttpResponse<IRacetrack>;
export type EntityArrayResponseType = HttpResponse<IRacetrack[]>;

@Injectable({ providedIn: 'root' })
export class RacetrackService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/racetracks');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/racetracks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(racetrack: IRacetrack): Observable<EntityResponseType> {
    return this.http.post<IRacetrack>(this.resourceUrl, racetrack, { observe: 'response' });
  }

  update(racetrack: IRacetrack): Observable<EntityResponseType> {
    return this.http.put<IRacetrack>(`${this.resourceUrl}/${getRacetrackIdentifier(racetrack) as number}`, racetrack, {
      observe: 'response',
    });
  }

  partialUpdate(racetrack: IRacetrack): Observable<EntityResponseType> {
    return this.http.patch<IRacetrack>(`${this.resourceUrl}/${getRacetrackIdentifier(racetrack) as number}`, racetrack, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRacetrack>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRacetrack[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRacetrack[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  findLayouts(id: number): Observable<HttpResponse<IRacetrackLayout[]>> {
    return this.http.get<IRacetrackLayout[]>(`${this.resourceUrl}/${id}/layouts`, { observe: 'response' });
  }

  findNextEvents(id: number): Observable<HttpResponse<EventEditionAndWinners[]>> {
    return this.http
      .get<EventEditionAndWinners[]>(`${this.resourceUrl}/${id}/events?type=future`, { observe: 'response' })
      .pipe(map((res: HttpResponse<EventEditionAndWinners[]>) => this.convertDateArrayFromServer(res)));
  }

  findPrevEvents(id: number, req?: any): Observable<HttpResponse<EventEditionAndWinners[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<EventEditionAndWinners[]>(`${this.resourceUrl}/${id}/events?type=past`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<EventEditionAndWinners[]>) => this.convertDateArrayFromServer(res)));
  }

  private convertDateArrayFromServer(res: HttpResponse<EventEditionAndWinners[]>): HttpResponse<EventEditionAndWinners[]> {
    if (res.body) {
      res.body.forEach((eventEditionWinners: EventEditionAndWinners) => {
        const eventDateCopy = Object.assign([], eventEditionWinners.eventEdition!.eventDate);
        eventEditionWinners.eventEdition!.eventDate =
          eventEditionWinners.eventEdition!.eventDate ?
            DateTime.fromObject({
              year: eventDateCopy[0],
              month: eventDateCopy[1],
              day: eventDateCopy[2]
            }) :
            undefined;
      });
    }
    return res;
  }
}
