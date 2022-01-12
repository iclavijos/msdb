import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IEventEdition, getEventEditionIdentifier } from '../event-edition.model';

export type EntityResponseType = HttpResponse<IEventEdition>;
export type EntityArrayResponseType = HttpResponse<IEventEdition[]>;

@Injectable({ providedIn: 'root' })
export class EventEditionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-editions');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/event-editions');

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

  addEventEditionToCollectionIfMissing(
    eventEditionCollection: IEventEdition[],
    ...eventEditionsToCheck: (IEventEdition | null | undefined)[]
  ): IEventEdition[] {
    const eventEditions: IEventEdition[] = eventEditionsToCheck.filter(isPresent);
    if (eventEditions.length > 0) {
      const eventEditionCollectionIdentifiers = eventEditionCollection.map(
        eventEditionItem => getEventEditionIdentifier(eventEditionItem)!
      );
      const eventEditionsToAdd = eventEditions.filter(eventEditionItem => {
        const eventEditionIdentifier = getEventEditionIdentifier(eventEditionItem);
        if (eventEditionIdentifier == null || eventEditionCollectionIdentifiers.includes(eventEditionIdentifier)) {
          return false;
        }
        eventEditionCollectionIdentifiers.push(eventEditionIdentifier);
        return true;
      });
      return [...eventEditionsToAdd, ...eventEditionCollection];
    }
    return eventEditionCollection;
  }

  findCalendarEvents(startDate: Date, endDate: Date): Observable<any[]> {
    const dateFormat = 'yyyy-MM-dd';
    const fromDate = dayjs(startDate).format(dateFormat);
    const toDate = dayjs(endDate).format(dateFormat);
    return this.http.get<any[]>(`${this.resourceUrl}/calendar/${String(fromDate)}/${String(toDate)}`);
  }

  protected convertDateFromClient(eventEdition: IEventEdition): IEventEdition {
    return Object.assign({}, eventEdition, {
      eventDate: eventEdition.eventDate?.isValid() ? eventEdition.eventDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.eventDate = res.body.eventDate ? dayjs(res.body.eventDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((eventEdition: IEventEdition) => {
        eventEdition.eventDate = eventEdition.eventDate ? dayjs(eventEdition.eventDate) : undefined;
      });
    }
    return res;
  }
}
