import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventSession, EventSession } from '../event-session.model';
import { EventSessionService } from '../service/event-session.service';

@Injectable({ providedIn: 'root' })
export class EventSessionRoutingResolveService implements Resolve<IEventSession> {
  constructor(protected service: EventSessionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventSession> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventSession: HttpResponse<IEventSession>) => {
          if (eventSession.body) {
            return of(eventSession.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventSession());
  }
}
