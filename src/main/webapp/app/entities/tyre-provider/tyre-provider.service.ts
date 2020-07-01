import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITyreProvider } from 'app/shared/model/tyre-provider.model';

type EntityResponseType = HttpResponse<ITyreProvider>;
type EntityArrayResponseType = HttpResponse<ITyreProvider[]>;

@Injectable({ providedIn: 'root' })
export class TyreProviderService {
  public resourceUrl = SERVER_API_URL + 'api/tyre-providers';
  public resourceSearchUrl = SERVER_API_URL + 'api/_typeahead/tyre-providers';
  public statsSearchUrl = SERVER_API_URL + 'api/stats/tyre-providers';

  constructor(protected http: HttpClient) {}

  create(tyreProvider: ITyreProvider): Observable<EntityResponseType> {
    return this.http.post<ITyreProvider>(this.resourceUrl, tyreProvider, { observe: 'response' });
  }

  update(tyreProvider: ITyreProvider): Observable<EntityResponseType> {
    return this.http.put<ITyreProvider>(this.resourceUrl, tyreProvider, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITyreProvider>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITyreProvider[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  typeahead(req?: any): Observable<EntityArrayResponseType> {
    return this.http.get<ITyreProvider[]>(`${this.resourceSearchUrl}?query=${req}`, { observe: 'response' });
  }

  getStats(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.statsSearchUrl}/${id}`, { observe: 'response' });
  }

  getStatsYear(id: number, year: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.statsSearchUrl}/${id}/${year}`, { observe: 'response' });
  }

  getYears(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.statsSearchUrl}/${id}/years`, { observe: 'response' });
  }
}
