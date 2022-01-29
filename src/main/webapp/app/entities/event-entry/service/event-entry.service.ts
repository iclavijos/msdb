import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Search } from 'app/core/request/request.model';
import { IEventEntry, getEventEntryIdentifier } from '../event-entry.model';

export type EntityResponseType = HttpResponse<IEventEntry>;
export type EntityArrayResponseType = HttpResponse<IEventEntry[]>;

@Injectable({ providedIn: 'root' })
export class EventEntryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-entries');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/event-entries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventEntry: IEventEntry): Observable<EntityResponseType> {
    return this.http.post<IEventEntry>(this.resourceUrl, eventEntry, { observe: 'response' });
  }

  update(eventEntry: IEventEntry): Observable<EntityResponseType> {
    return this.http.put<IEventEntry>(`${this.resourceUrl}/${getEventEntryIdentifier(eventEntry) as number}`, eventEntry, {
      observe: 'response',
    });
  }

  partialUpdate(eventEntry: IEventEntry): Observable<EntityResponseType> {
    return this.http.patch<IEventEntry>(`${this.resourceUrl}/${getEventEntryIdentifier(eventEntry) as number}`, eventEntry, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEventEntry>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEntry[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEntry[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  findEntries(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IEventEntry[]>(`api/event-editions/${id}/entries`, { observe: 'response' });
  }
}
