import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IRacetrack } from 'app/shared/model/racetrack.model';
import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';

type EntityResponseType = HttpResponse<IRacetrack>;
type EntityArrayResponseType = HttpResponse<IRacetrack[]>;

@Injectable({ providedIn: 'root' })
export class RacetrackService {
  public resourceUrl = SERVER_API_URL + 'api/racetracks';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/racetracks';

  constructor(protected http: HttpClient) {}

  create(racetrack: IRacetrack): Observable<EntityResponseType> {
    return this.http.post<IRacetrack>(this.resourceUrl, racetrack, { observe: 'response' });
  }

  update(racetrack: IRacetrack): Observable<EntityResponseType> {
    return this.http.put<IRacetrack>(this.resourceUrl, racetrack, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRacetrack>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRacetrack[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRacetrack[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  findLayouts(id: number): Observable<HttpResponse<IRacetrackLayout[]>> {
    return this.http.get<IRacetrackLayout[]>(`${this.resourceUrl}/${id}/layouts`, { observe: 'response' });
  }
}
