import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventEntryComponent } from '../list/event-entry.component';
import { EventEntryDetailComponent } from '../detail/event-entry-detail.component';
import { EventEntryUpdateComponent } from '../update/event-entry-update.component';
import { EventEntryRoutingResolveService } from './event-entry-routing-resolve.service';

const eventEntryRoute: Routes = [
  {
    path: '',
    component: EventEntryComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventEntryDetailComponent,
    resolve: {
      eventEntry: EventEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventEntryUpdateComponent,
    resolve: {
      eventEntry: EventEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventEntryUpdateComponent,
    resolve: {
      eventEntry: EventEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventEntryRoute)],
  exports: [RouterModule],
})
export class EventEntryRoutingModule {}
