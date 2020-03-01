import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IChassis } from 'app/shared/model/chassis.model';

type EntityResponseType = HttpResponse<IChassis>;
type EntityArrayResponseType = HttpResponse<IChassis[]>;

@Injectable({ providedIn: 'root' })
export class ChassisService {
  public resourceUrl = SERVER_API_URL + 'api/chassis';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/chassis';
  public statsSearchUrl = SERVER_API_URL + 'api/stats/chassis';

  constructor(protected http: HttpClient) {}

  create(chassis: IChassis): Observable<EntityResponseType> {
    return this.http.post<IChassis>(this.resourceUrl, chassis, { observe: 'response' });
  }

  update(chassis: IChassis): Observable<EntityResponseType> {
    return this.http.put<IChassis>(this.resourceUrl, chassis, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChassis>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChassis[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    return this.http.get<IChassis[]>(`${this.resourceSearchUrl}?query=${req}`, { observe: 'response' });
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
