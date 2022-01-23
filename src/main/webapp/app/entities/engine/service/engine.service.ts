import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IEngine, getEngineIdentifier } from '../engine.model';

export type EntityResponseType = HttpResponse<IEngine>;
export type EntityArrayResponseType = HttpResponse<IEngine[]>;

@Injectable({ providedIn: 'root' })
export class EngineService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/engines');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/engines');
  protected statsSearchUrl = this.applicationConfigService.getEndpointFor('api/stats/engines');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(engine: IEngine): Observable<EntityResponseType> {
    return this.http.post<IEngine>(this.resourceUrl, engine, { observe: 'response' });
  }

  update(engine: IEngine): Observable<EntityResponseType> {
    return this.http.put<IEngine>(`${this.resourceUrl}/${getEngineIdentifier(engine) as number}`, engine, { observe: 'response' });
  }

  partialUpdate(engine: IEngine): Observable<EntityResponseType> {
    return this.http.patch<IEngine>(`${this.resourceUrl}/${getEngineIdentifier(engine) as number}`, engine, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEngine>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEngine[]>(this.resourceUrl, { params: options, observe: 'response' });
  }


  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEngine[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
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

  getEvolutions(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IEngine[]>(`${this.resourceUrl}/${id}/evolutions`, { observe: 'response' });
  }
}
