import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventEntry } from '../../shared/model/event-entry.model';
import { EventEntryService } from './event-entry.service';
// import { EventEntryComponent } from './event-entry.component';
// import { EventEntryDetailComponent } from './event-entry-detail.component';
// import { EventEntryUpdateComponent } from './event-entry-update.component';
// import { EventEntryDeletePopupComponent } from './event-entry-delete-dialog.component';
import { IEventEntry } from '../../shared/model/event-entry.model';

@Injectable({ providedIn: 'root' })
export class EventEntryResolve implements Resolve<IEventEntry> {
  constructor(private service: EventEntryService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEventEntry> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EventEntry>) => response.ok),
        map((eventEntry: HttpResponse<EventEntry>) => eventEntry.body)
      );
    }
    return of(new EventEntry());
  }
}

export const eventEntryRoute: Routes = [
  //   {
  //     path: '',
  //     component: EventEntryComponent,
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   },
  //   {
  //     path: ':id/view',
  //     component: EventEntryDetailComponent,
  //     resolve: {
  //       eventEntry: EventEntryResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   },
  //   {
  //     path: 'new',
  //     component: EventEntryUpdateComponent,
  //     resolve: {
  //       eventEntry: EventEntryResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   },
  //   {
  //     path: ':id/edit',
  //     component: EventEntryUpdateComponent,
  //     resolve: {
  //       eventEntry: EventEntryResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   }
];

export const eventEntryPopupRoute: Routes = [
  //   {
  //     path: ':id/delete',
  //     component: EventEntryDeletePopupComponent,
  //     resolve: {
  //       eventEntry: EventEntryResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
  //     },
  //     canActivate: [UserRouteAccessService],
  //     outlet: 'popup'
  //   }
];
