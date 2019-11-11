import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPointsSystem } from 'app/shared/model/points-system.model';

type EntityResponseType = HttpResponse<IPointsSystem>;
type EntityArrayResponseType = HttpResponse<IPointsSystem[]>;

@Injectable({ providedIn: 'root' })
export class PointsSystemService {
  public resourceUrl = SERVER_API_URL + 'api/points-systems';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/points-systems';

  constructor(protected http: HttpClient) {}

  create(pointsSystem: IPointsSystem): Observable<EntityResponseType> {
    return this.http.post<IPointsSystem>(this.resourceUrl, pointsSystem, { observe: 'response' });
  }

  update(pointsSystem: IPointsSystem): Observable<EntityResponseType> {
    return this.http.put<IPointsSystem>(this.resourceUrl, pointsSystem, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPointsSystem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPointsSystem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPointsSystem[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
