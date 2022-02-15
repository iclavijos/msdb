import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateTime } from 'luxon';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IDriver, getDriverIdentifier } from '../driver.model';

export type EntityResponseType = HttpResponse<IDriver>;
export type EntityArrayResponseType = HttpResponse<IDriver[]>;

@Injectable({ providedIn: 'root' })
export class DriverService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/drivers');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/drivers');
  protected statsSearchUrl = this.applicationConfigService.getEndpointFor('api/stats/drivers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(driver: IDriver): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(driver);
    return this.http
      .post<IDriver>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(driver: IDriver): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(driver);
    return this.http
      .put<IDriver>(`${this.resourceUrl}/${getDriverIdentifier(driver) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(driver: IDriver): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(driver);
    return this.http
      .patch<IDriver>(`${this.resourceUrl}/${getDriverIdentifier(driver) as number}`, copy, { observe: 'response' })
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

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
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
    return Object.assign({}, driver, {
      birthDate: driver.birthDate?.isValid ? driver.birthDate.toISODate() : undefined,
      deathDate: driver.deathDate?.isValid ? driver.deathDate.toISODate() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      const birthCopy = Object.assign([], res.body.birthDate);
      const deathCopy = Object.assign([], res.body.deathDate);
      res.body.birthDate = res.body.birthDate ? DateTime.fromObject({
        year: birthCopy[0],
        month: birthCopy[1],
        day: birthCopy[2]
      }) : undefined;
      res.body.deathDate = res.body.deathDate ? DateTime.fromObject({
        year: deathCopy[0],
        month: deathCopy[1],
        day: deathCopy[2]
      }) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((driver: IDriver) => {
        const birthCopy = Object.assign([], driver.birthDate);
        const deathCopy = Object.assign([], driver.deathDate);
        driver.birthDate = driver.birthDate ? DateTime.fromObject({
          year: birthCopy[0],
          month: birthCopy[1],
          day: birthCopy[2]
        }) : undefined;
        driver.deathDate = driver.deathDate ? DateTime.fromObject({
          year: deathCopy[0],
          month: deathCopy[1],
          day: deathCopy[2]
        }) : undefined;
      });
    }
    return res;
  }
}
