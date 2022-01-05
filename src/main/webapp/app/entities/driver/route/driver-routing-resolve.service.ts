import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDriver, Driver } from '../driver.model';
import { DriverService } from '../service/driver.service';

@Injectable({ providedIn: 'root' })
export class DriverRoutingResolveService implements Resolve<IDriver> {
  constructor(protected service: DriverService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDriver> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((driver: HttpResponse<Driver>) => {
          if (driver.body) {
            return of(driver.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Driver());
  }
}
