import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ITyreProvider, getTyreProviderIdentifier } from '../tyre-provider.model';

export type EntityResponseType = HttpResponse<ITyreProvider>;
export type EntityArrayResponseType = HttpResponse<ITyreProvider[]>;

@Injectable({ providedIn: 'root' })
export class TyreProviderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tyre-providers');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/tyre-providers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tyreProvider: ITyreProvider): Observable<EntityResponseType> {
    return this.http.post<ITyreProvider>(this.resourceUrl, tyreProvider, { observe: 'response' });
  }

  update(tyreProvider: ITyreProvider): Observable<EntityResponseType> {
    return this.http.put<ITyreProvider>(`${this.resourceUrl}/${getTyreProviderIdentifier(tyreProvider) as number}`, tyreProvider, {
      observe: 'response',
    });
  }

  partialUpdate(tyreProvider: ITyreProvider): Observable<EntityResponseType> {
    return this.http.patch<ITyreProvider>(`${this.resourceUrl}/${getTyreProviderIdentifier(tyreProvider) as number}`, tyreProvider, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITyreProvider>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITyreProvider[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITyreProvider[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addTyreProviderToCollectionIfMissing(
    tyreProviderCollection: ITyreProvider[],
    ...tyreProvidersToCheck: (ITyreProvider | null | undefined)[]
  ): ITyreProvider[] {
    const tyreProviders: ITyreProvider[] = tyreProvidersToCheck.filter(isPresent);
    if (tyreProviders.length > 0) {
      const tyreProviderCollectionIdentifiers = tyreProviderCollection.map(
        tyreProviderItem => getTyreProviderIdentifier(tyreProviderItem)!
      );
      const tyreProvidersToAdd = tyreProviders.filter(tyreProviderItem => {
        const tyreProviderIdentifier = getTyreProviderIdentifier(tyreProviderItem);
        if (tyreProviderIdentifier == null || tyreProviderCollectionIdentifiers.includes(tyreProviderIdentifier)) {
          return false;
        }
        tyreProviderCollectionIdentifiers.push(tyreProviderIdentifier);
        return true;
      });
      return [...tyreProvidersToAdd, ...tyreProviderCollection];
    }
    return tyreProviderCollection;
  }
}
