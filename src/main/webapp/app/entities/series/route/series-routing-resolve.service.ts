import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISeries, Series } from '../series.model';
import { SeriesService } from '../service/series.service';

@Injectable({ providedIn: 'root' })
export class SeriesRoutingResolveService implements Resolve<ISeries> {
  constructor(protected service: SeriesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISeries> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((series: HttpResponse<Series>) => {
          if (series.body) {
            return of(series.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Series());
  }
}
