import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Search } from 'app/core/request/request.model';
import { IRacetrackLayout, getRacetrackLayoutIdentifier } from 'app/entities/racetrack-layout/racetrack-layout.model';

export type EntityResponseType = HttpResponse<IRacetrackLayout>;
export type EntityArrayResponseType = HttpResponse<IRacetrackLayout[]>;

@Injectable({ providedIn: 'root' })
export class RacetrackLayoutService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/racetrack-layouts');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/racetrack-layouts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(racetrackLayout: IRacetrackLayout): Observable<EntityResponseType> {
    return this.http.post<IRacetrackLayout>(this.resourceUrl, racetrackLayout, { observe: 'response' });
  }

  update(racetrackLayout: IRacetrackLayout): Observable<EntityResponseType> {
    return this.http.put<IRacetrackLayout>(
      `${this.resourceUrl}/${getRacetrackLayoutIdentifier(racetrackLayout) as number}`,
      racetrackLayout,
      { observe: 'response' }
    );
  }

  partialUpdate(racetrackLayout: IRacetrackLayout): Observable<EntityResponseType> {
    return this.http.patch<IRacetrackLayout>(
      `${this.resourceUrl}/${getRacetrackLayoutIdentifier(racetrackLayout) as number}`,
      racetrackLayout,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRacetrackLayout>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRacetrackLayout[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    // const options = createRequestOption(req);
    return this.http.get<IRacetrackLayout[]>(this.resourceSearchUrl, { params: { query: req.query }, observe: 'response' });
  }
}
