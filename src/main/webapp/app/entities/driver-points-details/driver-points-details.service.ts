import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDriverPointsDetails } from 'app/shared/model/driver-points-details.model';

type EntityResponseType = HttpResponse<IDriverPointsDetails>;
type EntityArrayResponseType = HttpResponse<IDriverPointsDetails[]>;

@Injectable({ providedIn: 'root' })
export class DriverPointsDetailsService {
  public resourceUrl = SERVER_API_URL + 'api/driver-points-details';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/driver-points-details';

  constructor(protected http: HttpClient) {}

  create(driverPointsDetails: IDriverPointsDetails): Observable<EntityResponseType> {
    return this.http.post<IDriverPointsDetails>(this.resourceUrl, driverPointsDetails, { observe: 'response' });
  }

  update(driverPointsDetails: IDriverPointsDetails): Observable<EntityResponseType> {
    return this.http.put<IDriverPointsDetails>(this.resourceUrl, driverPointsDetails, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDriverPointsDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDriverPointsDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDriverPointsDetails[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
