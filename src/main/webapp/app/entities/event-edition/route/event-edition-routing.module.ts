import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventEditionDetailComponent } from '../detail/event-edition-detail.component';
import { EventEditionUpdateComponent } from '../update/event-edition-update.component';
import { EventEditionNewRoutingResolveService } from './event-edition-new-routing-resolve.service';
import { EventEditionRoutingResolveService } from './event-edition-routing-resolve.service';

const eventEditionRoute: Routes = [
  {
    path: 'new',
    component: EventEditionUpdateComponent,
    resolve: {
      eventEdition: EventEditionNewRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    children: [
      {
        path: '',
        component: EventEditionDetailComponent,
        resolve: {
          eventEdition: EventEditionRoutingResolveService,
        },
        data: {
          authorities: ['ROLE_USER'],
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'edit',
        component: EventEditionUpdateComponent,
        resolve: {
          eventEdition: EventEditionRoutingResolveService,
        },
        data: {
          authorities: ['ROLE_USER'],
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'entry',
        loadChildren: () => import('app/entities/event-entry/event-entry.module').then(m => m.EventEntryModule),
      },
      {
        path: 'result',
        loadChildren: () => import('app/entities/event-entry-result/event-entry-result.module').then(m => m.EventEntryResultModule),
      },
      {
        path: 'session',
        loadChildren: () => import('app/entities/event-session/event-session.module').then(m => m.EventSessionModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(eventEditionRoute)],
  exports: [RouterModule],
})
export class EventEditionRoutingModule {}
