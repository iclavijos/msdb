import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IFuelProvider, getFuelProviderIdentifier } from '../fuel-provider.model';

export type EntityResponseType = HttpResponse<IFuelProvider>;
export type EntityArrayResponseType = HttpResponse<IFuelProvider[]>;

@Injectable({ providedIn: 'root' })
export class FuelProviderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fuel-providers');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/fuel-providers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(fuelProvider: IFuelProvider): Observable<EntityResponseType> {
    return this.http.post<IFuelProvider>(this.resourceUrl, fuelProvider, { observe: 'response' });
  }

  update(fuelProvider: IFuelProvider): Observable<EntityResponseType> {
    return this.http.put<IFuelProvider>(`${this.resourceUrl}/${getFuelProviderIdentifier(fuelProvider) as number}`, fuelProvider, {
      observe: 'response',
    });
  }

  partialUpdate(fuelProvider: IFuelProvider): Observable<EntityResponseType> {
    return this.http.patch<IFuelProvider>(`${this.resourceUrl}/${getFuelProviderIdentifier(fuelProvider) as number}`, fuelProvider, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFuelProvider>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFuelProvider[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFuelProvider[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addFuelProviderToCollectionIfMissing(
    fuelProviderCollection: IFuelProvider[],
    ...fuelProvidersToCheck: (IFuelProvider | null | undefined)[]
  ): IFuelProvider[] {
    const fuelProviders: IFuelProvider[] = fuelProvidersToCheck.filter(isPresent);
    if (fuelProviders.length > 0) {
      const fuelProviderCollectionIdentifiers = fuelProviderCollection.map(
        fuelProviderItem => getFuelProviderIdentifier(fuelProviderItem)!
      );
      const fuelProvidersToAdd = fuelProviders.filter(fuelProviderItem => {
        const fuelProviderIdentifier = getFuelProviderIdentifier(fuelProviderItem);
        if (fuelProviderIdentifier == null || fuelProviderCollectionIdentifiers.includes(fuelProviderIdentifier)) {
          return false;
        }
        fuelProviderCollectionIdentifiers.push(fuelProviderIdentifier);
        return true;
      });
      return [...fuelProvidersToAdd, ...fuelProviderCollection];
    }
    return fuelProviderCollection;
  }
}
