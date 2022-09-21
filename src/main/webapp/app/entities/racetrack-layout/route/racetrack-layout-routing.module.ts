import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RacetrackLayoutDetailComponent } from '../detail/racetrack-layout-detail.component';
import { RacetrackLayoutUpdateComponent } from '../update/racetrack-layout-update.component';
import { RacetrackLayoutRoutingResolveService } from './racetrack-layout-routing-resolve.service';
import { RacetrackLayoutNewRoutingResolveService } from './racetrack-layout-new-routing-resolve.service';

// import { RacetrackRoutingResolveService } from 'app/entities/racetrack/route/racetrack-routing-resolve.service';

const racetrackLayoutRoute: Routes = [
  {
    path: 'new',
    component: RacetrackLayoutUpdateComponent,
    resolve: {
      racetrackLayout: RacetrackLayoutNewRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: RacetrackLayoutDetailComponent,
    resolve: {
      racetrackLayout: RacetrackLayoutRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: RacetrackLayoutUpdateComponent,
    resolve: {
      racetrackLayout: RacetrackLayoutRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(racetrackLayoutRoute)],
  exports: [RouterModule],
})
export class RacetrackLayoutRoutingModule {}
