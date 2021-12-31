import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventEntryResult } from '../../shared/model/event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';
// import { EventEntryResultComponent } from './event-entry-result.component';
// import { EventEntryResultDetailComponent } from './event-entry-result-detail.component';
// import { EventEntryResultUpdateComponent } from './event-entry-result-update.component';
// import { EventEntryResultDeletePopupComponent } from './event-entry-result-delete-dialog.component';
import { IEventEntryResult } from '../../shared/model/event-entry-result.model';

@Injectable({ providedIn: 'root' })
export class EventEntryResultResolve implements Resolve<IEventEntryResult> {
  constructor(private service: EventEntryResultService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventEntryResult> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EventEntryResult>) => response.ok),
        map((eventEntryResult: HttpResponse<EventEntryResult>) => eventEntryResult.body)
      );
    }
    return of(new EventEntryResult());
  }
}

export const eventEntryResultRoute: Routes = [
  //   {
  //     path: '',
  //     component: EventEntryResultComponent,
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   },
  //   {
  //     path: ':id/view',
  //     component: EventEntryResultDetailComponent,
  //     resolve: {
  //       eventEntryResult: EventEntryResultResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   },
  //   {
  //     path: 'new',
  //     component: EventEntryResultUpdateComponent,
  //     resolve: {
  //       eventEntryResult: EventEntryResultResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   },
  //   {
  //     path: ':id/edit',
  //     component: EventEntryResultUpdateComponent,
  //     resolve: {
  //       eventEntryResult: EventEntryResultResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   }
];

export const eventEntryResultPopupRoute: Routes = [
  //   {
  //     path: ':id/delete',
  //     component: EventEntryResultDeletePopupComponent,
  //     resolve: {
  //       eventEntryResult: EventEntryResultResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
  //     },
  //     canActivate: [UserRouteAccessService],
  //     outlet: 'popup'
  //   }
];
