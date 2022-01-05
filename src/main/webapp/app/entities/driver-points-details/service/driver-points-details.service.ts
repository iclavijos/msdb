import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Search } from 'app/core/request/request.model';
import { IDriverPointsDetails, getDriverPointsDetailsIdentifier } from '../driver-points-details.model';

export type EntityResponseType = HttpResponse<IDriverPointsDetails>;
export type EntityArrayResponseType = HttpResponse<IDriverPointsDetails[]>;

@Injectable({ providedIn: 'root' })
export class DriverPointsDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/driver-points-details');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/driver-points-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(driverPointsDetails: IDriverPointsDetails): Observable<EntityResponseType> {
    return this.http.post<IDriverPointsDetails>(this.resourceUrl, driverPointsDetails, { observe: 'response' });
  }

  update(driverPointsDetails: IDriverPointsDetails): Observable<EntityResponseType> {
    return this.http.put<IDriverPointsDetails>(
      `${this.resourceUrl}/${getDriverPointsDetailsIdentifier(driverPointsDetails) as number}`,
      driverPointsDetails,
      { observe: 'response' }
    );
  }

  partialUpdate(driverPointsDetails: IDriverPointsDetails): Observable<EntityResponseType> {
    return this.http.patch<IDriverPointsDetails>(
      `${this.resourceUrl}/${getDriverPointsDetailsIdentifier(driverPointsDetails) as number}`,
      driverPointsDetails,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDriverPointsDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDriverPointsDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDriverPointsDetails[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addDriverPointsDetailsToCollectionIfMissing(
    driverPointsDetailsCollection: IDriverPointsDetails[],
    ...driverPointsDetailsToCheck: (IDriverPointsDetails | null | undefined)[]
  ): IDriverPointsDetails[] {
    const driverPointsDetails: IDriverPointsDetails[] = driverPointsDetailsToCheck.filter(isPresent);
    if (driverPointsDetails.length > 0) {
      const driverPointsDetailsCollectionIdentifiers = driverPointsDetailsCollection.map(
        driverPointsDetailsItem => getDriverPointsDetailsIdentifier(driverPointsDetailsItem)!
      );
      const driverPointsDetailsToAdd = driverPointsDetails.filter(driverPointsDetailsItem => {
        const driverPointsDetailsIdentifier = getDriverPointsDetailsIdentifier(driverPointsDetailsItem);
        if (driverPointsDetailsIdentifier == null || driverPointsDetailsCollectionIdentifiers.includes(driverPointsDetailsIdentifier)) {
          return false;
        }
        driverPointsDetailsCollectionIdentifiers.push(driverPointsDetailsIdentifier);
        return true;
      });
      return [...driverPointsDetailsToAdd, ...driverPointsDetailsCollection];
    }
    return driverPointsDetailsCollection;
  }
}
