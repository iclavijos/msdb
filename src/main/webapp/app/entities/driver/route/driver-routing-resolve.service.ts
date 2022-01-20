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
            const driverObj = new Driver(
              driver.body.id,
              driver.body.name,
              driver.body.surname,
              driver.body.birthDate,
              driver.body.birthPlace,
              driver.body.nationality,
              driver.body.deathDate,
              driver.body.deathPlace,
              driver.body.portraitContentType,
              driver.body.portrait,
              driver.body.portraitUrl,
            );
            return of(driverObj);
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
