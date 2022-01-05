import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChassis, Chassis } from '../chassis.model';
import { ChassisService } from '../service/chassis.service';

@Injectable({ providedIn: 'root' })
export class ChassisRoutingResolveService implements Resolve<IChassis> {
  constructor(protected service: ChassisService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChassis> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chassis: HttpResponse<Chassis>) => {
          if (chassis.body) {
            return of(chassis.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Chassis());
  }
}
