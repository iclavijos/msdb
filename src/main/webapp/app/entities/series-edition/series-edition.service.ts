import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ISeriesEdition } from 'app/shared/model/series-edition.model';

type EntityResponseType = HttpResponse<ISeriesEdition>;
type EntityArrayResponseType = HttpResponse<ISeriesEdition[]>;

@Injectable({ providedIn: 'root' })
export class SeriesEditionService {
  public resourceUrl = SERVER_API_URL + 'api/series-editions';
  public seriesResourceUrl = SERVER_API_URL + 'api/series';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/series-editions';

  constructor(protected http: HttpClient) {}

  create(seriesEdition: ISeriesEdition): Observable<EntityResponseType> {
    return this.http.post<ISeriesEdition>(this.resourceUrl, seriesEdition, { observe: 'response' });
  }

  update(seriesEdition: ISeriesEdition): Observable<EntityResponseType> {
    return this.http.put<ISeriesEdition>(this.resourceUrl, seriesEdition, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISeriesEdition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISeriesEdition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISeriesEdition[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  findSeriesEditions(idSeries: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISeriesEdition[]>(`${this.seriesResourceUrl}/${idSeries}/editions`, { params: options, observe: 'response' });
  }

  findPrevNextInSeries(id: number): Observable<any> {
    return this.http.get<any>(`${this.resourceUrl}/${id}/prevNextEdition`);
  }

  findEvents(id: number): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${this.resourceUrl}/${id}/events`, { observe: 'response' });
  }

  findDriversStandings(id: number): Observable<HttpResponse<any[]>> {
    return this.http.get<HttpResponse<any[]>>(`${this.resourceUrl}/${id}/standings/drivers`);
  }

  findTeamsStandings(id: number): Observable<HttpResponse<any[]>> {
    return this.http.get<HttpResponse<any[]>>(`${this.resourceUrl}/${id}/standings/teams`);
  }

  findManufacturersStandings(id: number): Observable<HttpResponse<any[]>> {
    return this.http.get<HttpResponse<any[]>>(`${this.resourceUrl}/${id}/standings/manufacturers`);
  }

  findDriversChampions(id: number): Observable<HttpResponse<any[]>> {
    return this.http.get<HttpResponse<any[]>>(`${this.resourceUrl}/${id}/champions/drivers`);
  }

  findTeamsChampions(id: number): Observable<HttpResponse<any[]>> {
    return this.http.get<HttpResponse<any[]>>(`${this.resourceUrl}/${id}/champions/teams`);
  }

  findDriversResultsByRace(id: number, category: string): Observable<any[]> {
    if (category) {
      return this.http.get<any[]>(`${this.resourceUrl}/${id}/results/${category}`);
    } else {
      return this.http.get<any[]>(`${this.resourceUrl}/${id}/results`);
    }
  }

  findDriversPointsByRace(id: number, category: string): Observable<any[]> {
    if (category) {
      return this.http.get<any[]>(`${this.resourceUrl}/${id}/points/${category}`);
    } else {
      return this.http.get<any[]>(`${this.resourceUrl}/${id}/points`);
    }
  }

  addEventToSeries(seriesId: number, eventId: number, racesData: any) {
    return this.http.post(`${this.resourceUrl}/${seriesId}/events/${eventId}`, racesData);
  }

  removeEventFromSeries(seriesId: number, eventId: number) {
    return this.http.delete(`${this.resourceUrl}/${seriesId}/events/${eventId}`);
  }

  clone(seriesEditionId: number, newPeriod: string) {
    return this.http.post(`${this.resourceUrl}/${seriesEditionId}/clone`, newPeriod);
  }

  updateStandings(seriesId: number) {
    return this.http.post(`${this.resourceUrl}/${seriesId}/standings`, null);
  }

  setDriversChampions(seriesEditionId: number, selectedDriversId: any) {
    return this.http.post(`${this.resourceUrl}/${seriesEditionId}/champions/drivers`, selectedDriversId);
  }

  setTeamsChampions(seriesEditionId: number, selectedTeamsId: any) {
    return this.http.post(`${this.resourceUrl}/${seriesEditionId}/champions/teams`, selectedTeamsId);
  }

  findActiveSeries(): Observable<EntityArrayResponseType> {
    return this.http.get<ISeriesEdition[]>(`${this.resourceUrl}/active`, { observe: 'response' });
  }
}
