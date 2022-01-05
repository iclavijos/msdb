import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventSessionComponent } from '../list/event-session.component';
import { EventSessionDetailComponent } from '../detail/event-session-detail.component';
import { EventSessionUpdateComponent } from '../update/event-session-update.component';
import { EventSessionRoutingResolveService } from './event-session-routing-resolve.service';

const eventSessionRoute: Routes = [
  {
    path: '',
    component: EventSessionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventSessionDetailComponent,
    resolve: {
      eventSession: EventSessionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventSessionUpdateComponent,
    resolve: {
      eventSession: EventSessionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventSessionUpdateComponent,
    resolve: {
      eventSession: EventSessionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventSessionRoute)],
  exports: [RouterModule],
})
export class EventSessionRoutingModule {}
