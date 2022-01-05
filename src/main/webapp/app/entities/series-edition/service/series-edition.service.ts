import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ISeriesEdition, getSeriesEditionIdentifier } from '../series-edition.model';

export type EntityResponseType = HttpResponse<ISeriesEdition>;
export type EntityArrayResponseType = HttpResponse<ISeriesEdition[]>;

@Injectable({ providedIn: 'root' })
export class SeriesEditionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/series-editions');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/series-editions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(seriesEdition: ISeriesEdition): Observable<EntityResponseType> {
    return this.http.post<ISeriesEdition>(this.resourceUrl, seriesEdition, { observe: 'response' });
  }

  update(seriesEdition: ISeriesEdition): Observable<EntityResponseType> {
    return this.http.put<ISeriesEdition>(`${this.resourceUrl}/${getSeriesEditionIdentifier(seriesEdition) as number}`, seriesEdition, {
      observe: 'response',
    });
  }

  partialUpdate(seriesEdition: ISeriesEdition): Observable<EntityResponseType> {
    return this.http.patch<ISeriesEdition>(`${this.resourceUrl}/${getSeriesEditionIdentifier(seriesEdition) as number}`, seriesEdition, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISeriesEdition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISeriesEdition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISeriesEdition[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addSeriesEditionToCollectionIfMissing(
    seriesEditionCollection: ISeriesEdition[],
    ...seriesEditionsToCheck: (ISeriesEdition | null | undefined)[]
  ): ISeriesEdition[] {
    const seriesEditions: ISeriesEdition[] = seriesEditionsToCheck.filter(isPresent);
    if (seriesEditions.length > 0) {
      const seriesEditionCollectionIdentifiers = seriesEditionCollection.map(
        seriesEditionItem => getSeriesEditionIdentifier(seriesEditionItem)!
      );
      const seriesEditionsToAdd = seriesEditions.filter(seriesEditionItem => {
        const seriesEditionIdentifier = getSeriesEditionIdentifier(seriesEditionItem);
        if (seriesEditionIdentifier == null || seriesEditionCollectionIdentifiers.includes(seriesEditionIdentifier)) {
          return false;
        }
        seriesEditionCollectionIdentifiers.push(seriesEditionIdentifier);
        return true;
      });
      return [...seriesEditionsToAdd, ...seriesEditionCollection];
    }
    return seriesEditionCollection;
  }
}
