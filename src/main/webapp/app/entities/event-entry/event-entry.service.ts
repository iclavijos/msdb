import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from '../../shared/util/request-util';
import { IEventEntry } from '../../shared/model/event-entry.model';
import { DriverCategory } from '../../shared/enumerations/driverCategory.enum';

type EntityResponseType = HttpResponse<IEventEntry>;
type EntityArrayResponseType = HttpResponse<IEventEntry[]>;

@Injectable({ providedIn: 'root' })
export class EventEntryService {
  public resourceUrlOld = `${SERVER_API_URL as string}api/event-entries`;
  public resourceUrl = `${SERVER_API_URL as string}api/event-editions/entries`;
  public resourceSearchUrl = `${SERVER_API_URL as string}api/_search/event-entries`;

  private driverCategories = DriverCategory;

  constructor(protected http: HttpClient) {}

  create(eventEntry: IEventEntry): Observable<EntityResponseType> {
    const copy: IEventEntry = Object.assign({}, eventEntry);
    copy.eventEdition = null;
    return this.http.post<IEventEntry>(`api/event-editions/${eventEntry.eventEdition.id as number}/entries`, copy, { observe: 'response' });
  }

  update(eventEntry: IEventEntry): Observable<EntityResponseType> {
    const copy: IEventEntry = Object.assign({}, eventEntry);
    copy.eventEdition = null;
    return this.http.put<IEventEntry>(`api/event-editions/${eventEntry.eventEdition.id as number}/entries`, copy, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEventEntry>(`${this.resourceUrlOld}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEntry[]>(this.resourceUrlOld, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEventEntry[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  findEntries(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<EntityArrayResponseType>(`api/event-editions/${id}/entries`, { observe: 'response' });
      // .pipe(map((res: EntityArrayResponseType) => this.transformDriverCategory(res)));
  }

//   private transformDriverCategory(res: EntityArrayResponseType): EntityArrayResponseType {
//     const result: IEventEntry[] = [];
//     if (res.body) {
//       res.body.forEach((entry: IEventEntry) => {
//         entry.drivers.forEach((driver: IDriver) =>
//           (driver.category =
//             driver.category ? driver.category as ICategory : null));
//       });
//     }
//     return res;
//   }
}
