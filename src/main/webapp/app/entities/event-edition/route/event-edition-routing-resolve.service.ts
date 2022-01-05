import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventEdition, EventEdition } from '../event-edition.model';
import { EventEditionService } from '../service/event-edition.service';

@Injectable({ providedIn: 'root' })
export class EventEditionRoutingResolveService implements Resolve<IEventEdition> {
  constructor(protected service: EventEditionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventEdition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventEdition: HttpResponse<EventEdition>) => {
          if (eventEdition.body) {
            return of(eventEdition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventEdition());
  }
}
