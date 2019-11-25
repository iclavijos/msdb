import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEngine } from 'app/shared/model/engine.model';

type EntityResponseType = HttpResponse<IEngine>;
type EntityArrayResponseType = HttpResponse<IEngine[]>;

@Injectable({ providedIn: 'root' })
export class EngineService {
  public resourceUrl = SERVER_API_URL + 'api/engines';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/engines';
  private typeAheadSearchUrl = SERVER_API_URL + 'api/_typeahead/engines';

  create(engine: IEngine): Observable<EntityResponseType> {
    return this.http.post<IEngine>(this.resourceUrl, engine, { observe: 'response' });
  }

  update(engine: IEngine): Observable<EntityResponseType> {
    return this.http.put<IEngine>(this.resourceUrl, engine, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEngine>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEngine[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEngine[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  typeahead(req?: string): Observable<ResponseWrapper> {
    return this.http.get(`${this.typeAheadSearchUrl}?query=${req}`).map((res: any) => this.convertResponse(res));
  }

  getStats(id: number): Observable<ResponseWrapper> {
    return this.http.get(`api/stats/engines/${id}`).map((res: Response) => this.convertResponse(res));
  }

  getStatsYear(id: number, year: number): Observable<ResponseWrapper> {
    return this.http.get(`api/stats/engines/${id}/${year}`).map((res: Response) => this.convertResponse(res));
  }

  getYears(id: number): Observable<ResponseWrapper> {
    return this.http.get(`api/stats/engines/${id}/years`).map((res: Response) => this.convertResponse(res));
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
   * Convert a returned JSON object to Engine.
   */
  private convertItemFromServer(json: any): Engine {
    const entity: Engine = Object.assign(new Engine(), json);
    return entity;
  }

  /**
   * Convert a Engine to a JSON which can be sent to the server.
   */
  private convert(engine: Engine): Engine {
    const copy: Engine = Object.assign({}, engine);
    return copy;
  }
}
