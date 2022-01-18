import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ITyreProvider, getTyreProviderIdentifier } from '../tyre-provider.model';

export type EntityResponseType = HttpResponse<ITyreProvider>;
export type EntityArrayResponseType = HttpResponse<ITyreProvider[]>;

@Injectable({ providedIn: 'root' })
export class TyreProviderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tyre-providers');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/tyre-providers');
  protected statsSearchUrl = this.applicationConfigService.getEndpointFor('api/stats/tyre-providers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tyreProvider: ITyreProvider): Observable<EntityResponseType> {
    return this.http.post<ITyreProvider>(this.resourceUrl, tyreProvider, { observe: 'response' });
  }

  update(tyreProvider: ITyreProvider): Observable<EntityResponseType> {
    return this.http.put<ITyreProvider>(`${this.resourceUrl}/${getTyreProviderIdentifier(tyreProvider) as number}`, tyreProvider, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITyreProvider>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITyreProvider[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITyreProvider[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  typeahead(req: string): Observable<EntityArrayResponseType> {
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
