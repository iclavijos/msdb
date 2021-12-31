import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from '../../shared/util/request-util';
import { IEvent } from '../../shared/model/event.model';

type EntityResponseType = HttpResponse<IEvent>;
type EntityArrayResponseType = HttpResponse<IEvent[]>;

@Injectable({ providedIn: 'root' })
export class EventService {
  public resourceUrl = SERVER_API_URL + 'api/events';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/events';

  constructor(protected http: HttpClient) {}

  create(event: IEvent): Observable<EntityResponseType> {
    return this.http.post<IEvent>(this.resourceUrl, event, { observe: 'response' });
  }

  update(event: IEvent): Observable<EntityResponseType> {
    return this.http.put<IEvent>(this.resourceUrl, event, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEvent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEvent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    return this.http.get<IEvent[]>(`${this.resourceSearchUrl}?query=${req}`, { observe: 'response' });
  }

  findEventEditionIds(idEvent: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${idEvent}/editionIds`);
  }
}
