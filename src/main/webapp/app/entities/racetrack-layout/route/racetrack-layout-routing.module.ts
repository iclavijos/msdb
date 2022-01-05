import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RacetrackLayoutComponent } from '../list/racetrack-layout.component';
import { RacetrackLayoutDetailComponent } from '../detail/racetrack-layout-detail.component';
import { RacetrackLayoutUpdateComponent } from '../update/racetrack-layout-update.component';
import { RacetrackLayoutRoutingResolveService } from './racetrack-layout-routing-resolve.service';

const racetrackLayoutRoute: Routes = [
  {
    path: '',
    component: RacetrackLayoutComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RacetrackLayoutDetailComponent,
    resolve: {
      racetrackLayout: RacetrackLayoutRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RacetrackLayoutUpdateComponent,
    resolve: {
      racetrackLayout: RacetrackLayoutRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RacetrackLayoutUpdateComponent,
    resolve: {
      racetrackLayout: RacetrackLayoutRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(racetrackLayoutRoute)],
  exports: [RouterModule],
})
export class RacetrackLayoutRoutingModule {}
