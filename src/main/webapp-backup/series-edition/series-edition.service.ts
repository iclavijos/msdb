import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ISeriesEdition } from 'app/shared/model/series-edition.model';

type EntityResponseType = HttpResponse<ISeriesEdition>;
type EntityArrayResponseType = HttpResponse<ISeriesEdition[]>;

@Injectable({ providedIn: 'root' })
export class SeriesEditionService {
  public resourceUrl = SERVER_API_URL + 'api/series-editions';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/series-editions';

  constructor(protected http: HttpClient) {}

  create(seriesEdition: ISeriesEdition): Observable<EntityResponseType> {
    return this.http.post<ISeriesEdition>(this.resourceUrl, seriesEdition, { observe: 'response' });
  }

  update(seriesEdition: ISeriesEdition): Observable<EntityResponseType> {
    return this.http.put<ISeriesEdition>(this.resourceUrl, seriesEdition, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISeriesEdition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISeriesEdition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISeriesEdition[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
