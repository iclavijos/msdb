import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Search } from 'app/core/request/request.model';
import { IEventEntryResult, getEventEntryResultIdentifier } from '../event-entry-result.model';

export type EntityResponseType = HttpResponse<IEventEntryResult>;
export type EntityArrayResponseType = HttpResponse<IEventEntryResult[]>;

@Injectable({ providedIn: 'root' })
export class EventEntryResultService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-entry-results');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/event-entry-results');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventEntryResult: IEventEntryResult): Observable<EntityResponseType> {
    return this.http.post<IEventEntryResult>(this.resourceUrl, eventEntryResult, { observe: 'response' });
  }

  update(eventEntryResult: IEventEntryResult): Observable<EntityResponseType> {
    return this.http.put<IEventEntryResult>(
      `${this.resourceUrl}/${getEventEntryResultIdentifier(eventEntryResult) as number}`,
      eventEntryResult,
      { observe: 'response' }
    );
  }

  partialUpdate(eventEntryResult: IEventEntryResult): Observable<EntityResponseType> {
    return this.http.patch<IEventEntryResult>(
      `${this.resourceUrl}/${getEventEntryResultIdentifier(eventEntryResult) as number}`,
      eventEntryResult,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEventEntryResult>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(eventEditionId: number, eventSessionId: number): Observable<EntityArrayResponseType> {
    return this.http.get<IEventEntryResult[]>(`api/event-editions/${eventEditionId}/event-sessions/${eventSessionId}/results`, {
      observe: 'response'
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEntryResult[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  processSessionResults(id: number): Observable<any> {
    return this.http.put(`api/event-editions/event-sessions/${id}/process-results`, null);
  }
}
