import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITeam } from 'app/shared/model/team.model';

type EntityResponseType = HttpResponse<ITeam>;
type EntityArrayResponseType = HttpResponse<ITeam[]>;

@Injectable({ providedIn: 'root' })
export class TeamService {
  public resourceUrl = SERVER_API_URL + 'api/teams';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/teams';
  public resourceTypeAheadUrl = SERVER_API_URL + 'api/_typeahead/teams';

  constructor(protected http: HttpClient) {}

  create(team: ITeam): Observable<EntityResponseType> {
    return this.http.post<ITeam>(this.resourceUrl, team, { observe: 'response' });
  }

  update(team: ITeam): Observable<EntityResponseType> {
    return this.http.put<ITeam>(this.resourceUrl, team, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITeam>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITeam[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITeam[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  typeahead(req): Observable<ResponseWrapper> {
    return this.http.get(`${this.resourceTypeAheadUrl}?query=${req}`).map((res: any) => this.convertResponse(res));
  }

  getStats(id: number): Observable<ResponseWrapper> {
    return this.http.get(`api/stats/teams/${id}`).map((res: Response) => this.convertResponse(res));
  }

  getStatsYear(id: number, year: number): Observable<ResponseWrapper> {
    return this.http.get(`api/stats/teams/${id}/${year}`).map((res: Response) => this.convertResponse(res));
  }

  getYears(id: number): Observable<ResponseWrapper> {
    return this.http.get(`api/stats/teams/${id}/years`).map((res: Response) => this.convertResponse(res));
  }
}
