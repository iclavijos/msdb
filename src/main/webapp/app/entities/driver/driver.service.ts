import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from '../../shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from '../../shared/util/request-util';
import { IDriver } from '../../shared/model/driver.model';

type EntityResponseType = HttpResponse<IDriver>;
type EntityArrayResponseType = HttpResponse<IDriver[]>;

@Injectable({ providedIn: 'root' })
export class DriverService {
  public resourceUrl = SERVER_API_URL + 'api/drivers';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/drivers';
  public statsSearchUrl = SERVER_API_URL + 'api/stats/drivers';

  constructor(protected http: HttpClient) {}

  create(driver: IDriver): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(driver);
    return this.http
      .post<IDriver>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(driver: IDriver): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(driver);
    return this.http
      .put<IDriver>(`${this.resourceUrl}/${driver.id}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDriver>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDriver[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDriver[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
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

  protected convertDateFromClient(driver: IDriver): IDriver {
    const copy: IDriver = Object.assign({}, driver, {
      birthDate: driver.birthDate != null && driver.birthDate.isValid() ? driver.birthDate.format(DATE_FORMAT) : null,
      deathDate: driver.deathDate != null && driver.deathDate.isValid() ? driver.deathDate.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      if (res.body.birthDate !== null) {
        res.body.birthDate[1]--;
        res.body.birthDate = moment(res.body.birthDate);
      }
      if (res.body.deathDate !== null) {
        res.body.deathDate[1]--;
        res.body.deathDate = moment(res.body.deathDate);
      }
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((driver: IDriver) => {
        if (driver.birthDate !== null) {
          driver.birthDate[1]--;
          driver.birthDate = moment(driver.birthDate);
        }
        if (driver.deathDate !== null) {
          driver.deathDate[1]--;
          driver.deathDate = moment(driver.deathDate);
        }
      });
    }
    return res;
  }
}
