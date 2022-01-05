import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventEntryResult, EventEntryResult } from '../event-entry-result.model';
import { EventEntryResultService } from '../service/event-entry-result.service';

@Injectable({ providedIn: 'root' })
export class EventEntryResultRoutingResolveService implements Resolve<IEventEntryResult> {
  constructor(protected service: EventEntryResultService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventEntryResult> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventEntryResult: HttpResponse<EventEntryResult>) => {
          if (eventEntryResult.body) {
            return of(eventEntryResult.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventEntryResult());
  }
}
