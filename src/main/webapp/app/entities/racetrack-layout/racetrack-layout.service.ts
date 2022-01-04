import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from '../../shared/util/request-util';
import { IRacetrackLayout } from '../../shared/model/racetrack-layout.model';

type EntityResponseType = HttpResponse<IRacetrackLayout>;
type EntityArrayResponseType = HttpResponse<IRacetrackLayout[]>;

@Injectable({ providedIn: 'root' })
export class RacetrackLayoutService {
  public resourceUrl = `${String(SERVER_API_URL)}api/racetrack-layouts`;
  public resourceSearchUrl = `${String(SERVER_API_URL)}api/_search/racetrack-layouts`;

  constructor(protected http: HttpClient) {}

  create(racetrackLayout: IRacetrackLayout): Observable<EntityResponseType> {
    return this.http.post<IRacetrackLayout>(this.resourceUrl, racetrackLayout, { observe: 'response' });
  }

  update(racetrackLayout: IRacetrackLayout): Observable<EntityResponseType> {
    return this.http.put<IRacetrackLayout>(this.resourceUrl, racetrackLayout, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRacetrackLayout>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRacetrackLayout[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: string): Observable<EntityArrayResponseType> {
    return this.http.get<IRacetrackLayout[]>(`${this.resourceSearchUrl}?query=${req}`, { observe: 'response' });
  }
}
