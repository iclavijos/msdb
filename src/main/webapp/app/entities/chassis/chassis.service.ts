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
    const options = createRequestOption(req);
    return this.http.get<IChassis[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  searchChassis(query?: any): Observable<ResponseWrapper> {
    return this.http.get('api/_typeahead/chassis?query=' + query).map((res: Response) => this.convertResponse(res));
  }

  getStats(id: number): Observable<ResponseWrapper> {
    return this.http.get(`api/stats/chassis/${id}`).map((res: Response) => this.convertResponse(res));
  }

  getStatsYear(id: number, year: number): Observable<ResponseWrapper> {
    return this.http.get(`api/stats/chassis/${id}/${year}`).map((res: Response) => this.convertResponse(res));
  }

  getYears(id: number): Observable<ResponseWrapper> {
    return this.http.get(`api/stats/chassis/${id}/years`).map((res: Response) => this.convertResponse(res));
  }

  private convertResponse(res: Response): ResponseWrapper {
    const jsonResponse = res.json();
    const result = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      result.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return new ResponseWrapper(res.headers, result, res.status);
  }

  /**
   * Convert a returned JSON object to Chassis.
   */
  private convertItemFromServer(json: any): Chassis {
    const entity: Chassis = Object.assign(new Chassis(), json);
    return entity;
  }

  /**
   * Convert a Chassis to a JSON which can be sent to the server.
   */
  private convert(chassis: Chassis): Chassis {
    const copy: Chassis = Object.assign({}, chassis);
    return copy;
  }
}
