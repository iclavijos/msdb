import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRacetrack, Racetrack } from '../racetrack.model';
import { RacetrackService } from '../service/racetrack.service';

@Injectable({ providedIn: 'root' })
export class RacetrackRoutingResolveService implements Resolve<IRacetrack> {
  constructor(protected service: RacetrackService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRacetrack> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((racetrack: HttpResponse<Racetrack>) => {
          if (racetrack.body) {
            return of(racetrack.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Racetrack());
  }
}
