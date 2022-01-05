import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IChassis, getChassisIdentifier } from '../chassis.model';

export type EntityResponseType = HttpResponse<IChassis>;
export type EntityArrayResponseType = HttpResponse<IChassis[]>;

@Injectable({ providedIn: 'root' })
export class ChassisService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chassis');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/chassis');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chassis: IChassis): Observable<EntityResponseType> {
    return this.http.post<IChassis>(this.resourceUrl, chassis, { observe: 'response' });
  }

  update(chassis: IChassis): Observable<EntityResponseType> {
    return this.http.put<IChassis>(`${this.resourceUrl}/${getChassisIdentifier(chassis) as number}`, chassis, { observe: 'response' });
  }

  partialUpdate(chassis: IChassis): Observable<EntityResponseType> {
    return this.http.patch<IChassis>(`${this.resourceUrl}/${getChassisIdentifier(chassis) as number}`, chassis, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChassis>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChassis[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChassis[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addChassisToCollectionIfMissing(chassisCollection: IChassis[], ...chassisToCheck: (IChassis | null | undefined)[]): IChassis[] {
    const chassis: IChassis[] = chassisToCheck.filter(isPresent);
    if (chassis.length > 0) {
      const chassisCollectionIdentifiers = chassisCollection.map(chassisItem => getChassisIdentifier(chassisItem)!);
      const chassisToAdd = chassis.filter(chassisItem => {
        const chassisIdentifier = getChassisIdentifier(chassisItem);
        if (chassisIdentifier == null || chassisCollectionIdentifiers.includes(chassisIdentifier)) {
          return false;
        }
        chassisCollectionIdentifiers.push(chassisIdentifier);
        return true;
      });
      return [...chassisToAdd, ...chassisCollection];
    }
    return chassisCollection;
  }
}
