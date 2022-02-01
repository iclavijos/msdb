import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IEvent, getEventIdentifier } from '../event.model';

export type EntityResponseType = HttpResponse<IEvent>;
export type EntityArrayResponseType = HttpResponse<IEvent[]>;

@Injectable({ providedIn: 'root' })
export class EventService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/events');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/events');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(event: IEvent): Observable<EntityResponseType> {
    return this.http.post<IEvent>(this.resourceUrl, event, { observe: 'response' });
  }

  update(event: IEvent): Observable<EntityResponseType> {
    return this.http.put<IEvent>(`${this.resourceUrl}/${getEventIdentifier(event) as number}`, event, { observe: 'response' });
  }

  partialUpdate(event: IEvent): Observable<EntityResponseType> {
    return this.http.patch<IEvent>(`${this.resourceUrl}/${getEventIdentifier(event) as number}`, event, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEvent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEvent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEvent[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  findEventEditionIds(idEvent: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.resourceUrl}/${idEvent}/editionIds`);
  }
}
