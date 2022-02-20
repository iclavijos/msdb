import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IEventEdition, EventEdition } from '../event-edition.model';

@Injectable({ providedIn: 'root' })
export class EventEditionNewRoutingResolveService implements Resolve<IEventEdition> {
  constructor(protected service: EventService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventEdition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((event: HttpResponse<IEvent>) => {
          if (event.body) {
            const eventEdition = new EventEdition();
            eventEdition.event = event.body;
            return of(eventEdition);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    this.router.navigate(['404']);
    return EMPTY;
  }
}
