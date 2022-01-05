import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFuelProvider, FuelProvider } from '../fuel-provider.model';
import { FuelProviderService } from '../service/fuel-provider.service';

@Injectable({ providedIn: 'root' })
export class FuelProviderRoutingResolveService implements Resolve<IFuelProvider> {
  constructor(protected service: FuelProviderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFuelProvider> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fuelProvider: HttpResponse<FuelProvider>) => {
          if (fuelProvider.body) {
            return of(fuelProvider.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FuelProvider());
  }
}
