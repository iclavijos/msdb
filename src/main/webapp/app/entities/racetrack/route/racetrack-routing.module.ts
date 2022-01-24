import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RacetrackComponent } from '../list/racetrack.component';
import { RacetrackDetailComponent } from '../detail/racetrack-detail.component';
import { RacetrackUpdateComponent } from '../update/racetrack-update.component';
import { RacetrackRoutingResolveService } from './racetrack-routing-resolve.service';

const racetrackRoute: Routes = [
  {
    path: '',
    component: RacetrackComponent,
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'name,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RacetrackDetailComponent,
    resolve: {
      racetrack: RacetrackRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: RacetrackUpdateComponent,
    resolve: {
      racetrack: RacetrackRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: RacetrackUpdateComponent,
    resolve: {
      racetrack: RacetrackRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(racetrackRoute)],
  exports: [RouterModule],
})
export class RacetrackRoutingModule {}
