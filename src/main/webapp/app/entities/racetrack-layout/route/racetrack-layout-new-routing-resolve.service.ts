import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRacetrackLayout, RacetrackLayout } from '../racetrack-layout.model';
import { IRacetrack } from 'app/entities/racetrack/racetrack.model';
import { RacetrackService } from 'app/entities/racetrack/service/racetrack.service';

@Injectable({ providedIn: 'root' })
export class RacetrackLayoutNewRoutingResolveService implements Resolve<IRacetrackLayout> {
  constructor(protected service: RacetrackService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRacetrackLayout> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((racetrack: HttpResponse<IRacetrack>) => {
          if (racetrack.body) {
            const racetrackLayout = new RacetrackLayout();
            racetrackLayout.racetrack = racetrack.body;
            return of(racetrackLayout);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    this.router.navigate(['404']);
    return EMPTY;
  }
}
