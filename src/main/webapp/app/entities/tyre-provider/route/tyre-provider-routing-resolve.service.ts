import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITyreProvider, TyreProvider } from '../tyre-provider.model';
import { TyreProviderService } from '../service/tyre-provider.service';

@Injectable({ providedIn: 'root' })
export class TyreProviderRoutingResolveService implements Resolve<ITyreProvider> {
  constructor(protected service: TyreProviderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITyreProvider> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tyreProvider: HttpResponse<ITyreProvider>) => {
          if (tyreProvider.body) {
            return of(tyreProvider.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TyreProvider());
  }
}
