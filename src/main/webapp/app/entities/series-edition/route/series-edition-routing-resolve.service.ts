import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISeriesEdition, SeriesEdition } from '../series-edition.model';
import { SeriesEditionService } from '../service/series-edition.service';

@Injectable({ providedIn: 'root' })
export class SeriesEditionRoutingResolveService implements Resolve<ISeriesEdition> {
  constructor(protected service: SeriesEditionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISeriesEdition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((seriesEdition: HttpResponse<SeriesEdition>) => {
          if (seriesEdition.body) {
            return of(seriesEdition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SeriesEdition());
  }
}
