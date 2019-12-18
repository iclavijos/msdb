import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEventEntry } from 'app/shared/model/event-entry.model';

type EntityResponseType = HttpResponse<IEventEntry>;
type EntityArrayResponseType = HttpResponse<IEventEntry[]>;

@Injectable({ providedIn: 'root' })
export class EventEntryService {
  public resourceUrl = SERVER_API_URL + 'api/event-entries';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/event-entries';

  constructor(protected http: HttpClient) {}

  create(eventEntry: IEventEntry): Observable<EntityResponseType> {
    return this.http.post<IEventEntry>(this.resourceUrl, eventEntry, { observe: 'response' });
  }

  update(eventEntry: IEventEntry): Observable<EntityResponseType> {
    return this.http.put<IEventEntry>(this.resourceUrl, eventEntry, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEventEntry>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEntry[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEntry[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
