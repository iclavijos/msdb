import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRacetrackLayout, RacetrackLayout } from '../racetrack-layout.model';
import { RacetrackLayoutService } from '../service/racetrack-layout.service';

@Injectable({ providedIn: 'root' })
export class RacetrackLayoutRoutingResolveService implements Resolve<IRacetrackLayout> {
  constructor(protected service: RacetrackLayoutService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRacetrackLayout> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((racetrackLayout: HttpResponse<RacetrackLayout>) => {
          if (racetrackLayout.body) {
            return of(racetrackLayout.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RacetrackLayout());
  }
}
