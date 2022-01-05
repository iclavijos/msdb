import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventEntryResultComponent } from '../list/event-entry-result.component';
import { EventEntryResultDetailComponent } from '../detail/event-entry-result-detail.component';
import { EventEntryResultUpdateComponent } from '../update/event-entry-result-update.component';
import { EventEntryResultRoutingResolveService } from './event-entry-result-routing-resolve.service';

const eventEntryResultRoute: Routes = [
  {
    path: '',
    component: EventEntryResultComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventEntryResultDetailComponent,
    resolve: {
      eventEntryResult: EventEntryResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventEntryResultUpdateComponent,
    resolve: {
      eventEntryResult: EventEntryResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventEntryResultUpdateComponent,
    resolve: {
      eventEntryResult: EventEntryResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventEntryResultRoute)],
  exports: [RouterModule],
})
export class EventEntryResultRoutingModule {}
