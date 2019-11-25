import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDriver } from 'app/shared/model/driver.model';

type EntityResponseType = HttpResponse<IDriver>;
type EntityArrayResponseType = HttpResponse<IDriver[]>;

@Injectable({ providedIn: 'root' })
export class DriverService {
  public resourceUrl = SERVER_API_URL + 'api/drivers';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/drivers';

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
      .put<IDriver>(this.resourceUrl, copy, { observe: 'response' })
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

  protected convertDateFromClient(driver: IDriver): IDriver {
    const copy: IDriver = Object.assign({}, driver, {
      birthDate: driver.birthDate != null && driver.birthDate.isValid() ? driver.birthDate.format(DATE_FORMAT) : null,
      deathDate: driver.deathDate != null && driver.deathDate.isValid() ? driver.deathDate.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.birthDate = res.body.birthDate != null ? moment(res.body.birthDate) : null;
      res.body.deathDate = res.body.deathDate != null ? moment(res.body.deathDate) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((driver: IDriver) => {
        driver.birthDate = driver.birthDate != null ? moment(driver.birthDate) : null;
        driver.deathDate = driver.deathDate != null ? moment(driver.deathDate) : null;
      });
    }
    return res;
  }
}
