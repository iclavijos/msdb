import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from '../../shared/util/request-util';
import { ITeam } from '../../shared/model/team.model';

type EntityResponseType = HttpResponse<ITeam>;
type EntityArrayResponseType = HttpResponse<ITeam[]>;

@Injectable({ providedIn: 'root' })
export class TeamService {
  public resourceUrl = `${String(SERVER_API_URL)}api/teams`;
  public resourceSearchUrl = `${String(SERVER_API_URL)}api/_search/teams`;
  public statsSearchUrl = `${String(SERVER_API_URL)}api/stats/teams`;

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
