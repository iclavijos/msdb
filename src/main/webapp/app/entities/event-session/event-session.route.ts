import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventSession } from '../../shared/model/event-session.model';
import { EventSessionService } from './event-session.service';
// import { EventSessionUpdateComponent } from './event-session-update.component';
import { IEventSession } from '../../shared/model/event-session.model';

@Injectable({ providedIn: 'root' })
export class EventSessionResolve implements Resolve<IEventSession> {
  constructor(private service: EventSessionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventSession> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EventSession>) => response.ok),
        map((eventSession: HttpResponse<EventSession>) => eventSession.body)
      );
    }
    return of(new EventSession());
  }
}

export const eventSessionRoute: Routes = [
  //   {
  //     path: 'new',
  //     component: EventSessionUpdateComponent,
  //     resolve: {
  //       eventSession: EventSessionResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventSession.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   },
  //   {
  //     path: ':id/edit',
  //     component: EventSessionUpdateComponent,
  //     resolve: {
  //       eventSession: EventSessionResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventSession.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   }
];
