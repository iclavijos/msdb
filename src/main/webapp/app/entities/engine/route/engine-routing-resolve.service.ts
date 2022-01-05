import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEngine, Engine } from '../engine.model';
import { EngineService } from '../service/engine.service';

@Injectable({ providedIn: 'root' })
export class EngineRoutingResolveService implements Resolve<IEngine> {
  constructor(protected service: EngineService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEngine> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((engine: HttpResponse<Engine>) => {
          if (engine.body) {
            return of(engine.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Engine());
  }
}
