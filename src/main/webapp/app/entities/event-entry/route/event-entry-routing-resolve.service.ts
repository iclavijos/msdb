import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventEntry, EventEntry } from '../event-entry.model';
import { EventEntryService } from '../service/event-entry.service';

@Injectable({ providedIn: 'root' })
export class EventEntryRoutingResolveService implements Resolve<IEventEntry> {
  constructor(protected service: EventEntryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventEntry> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eventEntry: HttpResponse<EventEntry>) => {
          if (eventEntry.body) {
            return of(eventEntry.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EventEntry());
  }
}
