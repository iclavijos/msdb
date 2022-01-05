import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPointsSystem, PointsSystem } from '../points-system.model';
import { PointsSystemService } from '../service/points-system.service';

@Injectable({ providedIn: 'root' })
export class PointsSystemRoutingResolveService implements Resolve<IPointsSystem> {
  constructor(protected service: PointsSystemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPointsSystem> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pointsSystem: HttpResponse<PointsSystem>) => {
          if (pointsSystem.body) {
            return of(pointsSystem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PointsSystem());
  }
}
