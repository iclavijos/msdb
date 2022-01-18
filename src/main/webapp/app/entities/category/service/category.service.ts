import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ICategory, getCategoryIdentifier } from '../category.model';

export type EntityResponseType = HttpResponse<ICategory>;
export type EntityArrayResponseType = HttpResponse<ICategory[]>;

@Injectable({ providedIn: 'root' })
export class CategoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/categories');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/categories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(category: ICategory): Observable<EntityResponseType> {
    return this.http.post<ICategory>(this.resourceUrl, category, { observe: 'response' });
  }

  update(category: ICategory): Observable<EntityResponseType> {
    return this.http.put<ICategory>(`${this.resourceUrl}/${getCategoryIdentifier(category) as number}`, category, { observe: 'response' });
  }

  partialUpdate(category: ICategory): Observable<EntityResponseType> {
    return this.http.patch<ICategory>(`${this.resourceUrl}/${getCategoryIdentifier(category) as number}`, category, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategory[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addCategoryToCollectionIfMissing(categoryCollection: ICategory[], ...categoriesToCheck: (ICategory | null | undefined)[]): ICategory[] {
    const categories: ICategory[] = categoriesToCheck.filter(isPresent);
    if (categories.length > 0) {
      const categoryCollectionIdentifiers = categoryCollection.map(categoryItem => getCategoryIdentifier(categoryItem)!);
      const categoriesToAdd = categories.filter(categoryItem => {
        const categoryIdentifier = getCategoryIdentifier(categoryItem);
        if (categoryIdentifier == null || categoryCollectionIdentifiers.includes(categoryIdentifier)) {
          return false;
        }
        categoryCollectionIdentifiers.push(categoryIdentifier);
        return true;
      });
      return [...categoriesToAdd, ...categoryCollection];
    }
    return categoryCollection;
  }
}
