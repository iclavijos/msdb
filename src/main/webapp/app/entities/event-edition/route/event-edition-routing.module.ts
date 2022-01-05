import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventEditionComponent } from '../list/event-edition.component';
import { EventEditionDetailComponent } from '../detail/event-edition-detail.component';
import { EventEditionUpdateComponent } from '../update/event-edition-update.component';
import { EventEditionRoutingResolveService } from './event-edition-routing-resolve.service';

const eventEditionRoute: Routes = [
  {
    path: '',
    component: EventEditionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventEditionDetailComponent,
    resolve: {
      eventEdition: EventEditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventEditionUpdateComponent,
    resolve: {
      eventEdition: EventEditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventEditionUpdateComponent,
    resolve: {
      eventEdition: EventEditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventEditionRoute)],
  exports: [RouterModule],
})
export class EventEditionRoutingModule {}
