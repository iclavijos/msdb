import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventSession } from 'app/shared/model/event-session.model';
import { EventSessionService } from './event-session.service';
import { EventSessionComponent } from './event-session.component';
// import { EventSessionDetailComponent } from './event-session-detail.component';
// import { EventSessionUpdateComponent } from './event-session-update.component';
// import { EventSessionDeletePopupComponent } from './event-session-delete-dialog.component';
import { IEventSession } from 'app/shared/model/event-session.model';

@Injectable({ providedIn: 'root' })
export class EventSessionResolve implements Resolve<IEventSession> {
  constructor(private service: EventSessionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEventSession> {
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
  //     path: '',
  //     component: EventSessionComponent,
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventSession.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   },
  //   {
  //     path: ':id/view',
  //     component: EventSessionDetailComponent,
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

export const eventSessionPopupRoute: Routes = [
  //   {
  //     path: ':id/delete',
  //     component: EventSessionDeletePopupComponent,
  //     resolve: {
  //       eventSession: EventSessionResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventSession.home.title'
  //     },
  //     canActivate: [UserRouteAccessService],
  //     outlet: 'popup'
  //   }
];
