import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IRacetrack, getRacetrackIdentifier } from '../racetrack.model';

export type EntityResponseType = HttpResponse<IRacetrack>;
export type EntityArrayResponseType = HttpResponse<IRacetrack[]>;

@Injectable({ providedIn: 'root' })
export class RacetrackService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/racetracks');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/racetracks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(racetrack: IRacetrack): Observable<EntityResponseType> {
    return this.http.post<IRacetrack>(this.resourceUrl, racetrack, { observe: 'response' });
  }

  update(racetrack: IRacetrack): Observable<EntityResponseType> {
    return this.http.put<IRacetrack>(`${this.resourceUrl}/${getRacetrackIdentifier(racetrack) as number}`, racetrack, {
      observe: 'response',
    });
  }

  partialUpdate(racetrack: IRacetrack): Observable<EntityResponseType> {
    return this.http.patch<IRacetrack>(`${this.resourceUrl}/${getRacetrackIdentifier(racetrack) as number}`, racetrack, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRacetrack>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRacetrack[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRacetrack[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addRacetrackToCollectionIfMissing(
    racetrackCollection: IRacetrack[],
    ...racetracksToCheck: (IRacetrack | null | undefined)[]
  ): IRacetrack[] {
    const racetracks: IRacetrack[] = racetracksToCheck.filter(isPresent);
    if (racetracks.length > 0) {
      const racetrackCollectionIdentifiers = racetrackCollection.map(racetrackItem => getRacetrackIdentifier(racetrackItem)!);
      const racetracksToAdd = racetracks.filter(racetrackItem => {
        const racetrackIdentifier = getRacetrackIdentifier(racetrackItem);
        if (racetrackIdentifier == null || racetrackCollectionIdentifiers.includes(racetrackIdentifier)) {
          return false;
        }
        racetrackCollectionIdentifiers.push(racetrackIdentifier);
        return true;
      });
      return [...racetracksToAdd, ...racetrackCollection];
    }
    return racetrackCollection;
  }
}
