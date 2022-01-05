import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
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

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEntryResult[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEntryResult[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addEventEntryResultToCollectionIfMissing(
    eventEntryResultCollection: IEventEntryResult[],
    ...eventEntryResultsToCheck: (IEventEntryResult | null | undefined)[]
  ): IEventEntryResult[] {
    const eventEntryResults: IEventEntryResult[] = eventEntryResultsToCheck.filter(isPresent);
    if (eventEntryResults.length > 0) {
      const eventEntryResultCollectionIdentifiers = eventEntryResultCollection.map(
        eventEntryResultItem => getEventEntryResultIdentifier(eventEntryResultItem)!
      );
      const eventEntryResultsToAdd = eventEntryResults.filter(eventEntryResultItem => {
        const eventEntryResultIdentifier = getEventEntryResultIdentifier(eventEntryResultItem);
        if (eventEntryResultIdentifier == null || eventEntryResultCollectionIdentifiers.includes(eventEntryResultIdentifier)) {
          return false;
        }
        eventEntryResultCollectionIdentifiers.push(eventEntryResultIdentifier);
        return true;
      });
      return [...eventEntryResultsToAdd, ...eventEntryResultCollection];
    }
    return eventEntryResultCollection;
  }
}
