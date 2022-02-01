import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventComponent } from '../list/event.component';
import { EventDetailComponent } from '../detail/event-detail.component';
import { EventUpdateComponent } from '../update/event-update.component';
import { EventRoutingResolveService } from './event-routing-resolve.service';

const eventRoute: Routes = [
  {
    path: '',
    component: EventComponent,
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'name,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventDetailComponent,
    resolve: {
      event: EventRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: EventUpdateComponent,
    resolve: {
      event: EventRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: EventUpdateComponent,
    resolve: {
      event: EventRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
    },
    canActivate: [UserRouteAccessService],
  },
//   {
//     path: 'edition',
//     loadChildren: () => import('../event-edition/event-edition.module').then(m => m.MotorsportsDatabaseEventEditionModule)
//   }
];

@NgModule({
  imports: [RouterModule.forChild(eventRoute)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
