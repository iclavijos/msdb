import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IPointsSystem, getPointsSystemIdentifier } from '../points-system.model';

export type EntityResponseType = HttpResponse<IPointsSystem>;
export type EntityArrayResponseType = HttpResponse<IPointsSystem[]>;

@Injectable({ providedIn: 'root' })
export class PointsSystemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/points-systems');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/points-systems');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pointsSystem: IPointsSystem): Observable<EntityResponseType> {
    return this.http.post<IPointsSystem>(this.resourceUrl, pointsSystem, { observe: 'response' });
  }

  update(pointsSystem: IPointsSystem): Observable<EntityResponseType> {
    return this.http.put<IPointsSystem>(`${this.resourceUrl}/${getPointsSystemIdentifier(pointsSystem) as number}`, pointsSystem, {
      observe: 'response',
    });
  }

  partialUpdate(pointsSystem: IPointsSystem): Observable<EntityResponseType> {
    return this.http.patch<IPointsSystem>(`${this.resourceUrl}/${getPointsSystemIdentifier(pointsSystem) as number}`, pointsSystem, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPointsSystem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPointsSystem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPointsSystem[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addPointsSystemToCollectionIfMissing(
    pointsSystemCollection: IPointsSystem[],
    ...pointsSystemsToCheck: (IPointsSystem | null | undefined)[]
  ): IPointsSystem[] {
    const pointsSystems: IPointsSystem[] = pointsSystemsToCheck.filter(isPresent);
    if (pointsSystems.length > 0) {
      const pointsSystemCollectionIdentifiers = pointsSystemCollection.map(
        pointsSystemItem => getPointsSystemIdentifier(pointsSystemItem)!
      );
      const pointsSystemsToAdd = pointsSystems.filter(pointsSystemItem => {
        const pointsSystemIdentifier = getPointsSystemIdentifier(pointsSystemItem);
        if (pointsSystemIdentifier == null || pointsSystemCollectionIdentifiers.includes(pointsSystemIdentifier)) {
          return false;
        }
        pointsSystemCollectionIdentifiers.push(pointsSystemIdentifier);
        return true;
      });
      return [...pointsSystemsToAdd, ...pointsSystemCollection];
    }
    return pointsSystemCollection;
  }
}
