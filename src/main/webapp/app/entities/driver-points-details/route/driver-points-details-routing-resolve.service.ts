import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDriverPointsDetails, DriverPointsDetails } from '../driver-points-details.model';
import { DriverPointsDetailsService } from '../service/driver-points-details.service';

@Injectable({ providedIn: 'root' })
export class DriverPointsDetailsRoutingResolveService implements Resolve<IDriverPointsDetails> {
  constructor(protected service: DriverPointsDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDriverPointsDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((driverPointsDetails: HttpResponse<DriverPointsDetails>) => {
          if (driverPointsDetails.body) {
            return of(driverPointsDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DriverPointsDetails());
  }
}
