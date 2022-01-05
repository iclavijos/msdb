import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TeamComponent } from '../list/team.component';
import { TeamDetailComponent } from '../detail/team-detail.component';
import { TeamUpdateComponent } from '../update/team-update.component';
import { TeamRoutingResolveService } from './team-routing-resolve.service';

const teamRoute: Routes = [
  {
    path: '',
    component: TeamComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TeamDetailComponent,
    resolve: {
      team: TeamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TeamUpdateComponent,
    resolve: {
      team: TeamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TeamUpdateComponent,
    resolve: {
      team: TeamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(teamRoute)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
