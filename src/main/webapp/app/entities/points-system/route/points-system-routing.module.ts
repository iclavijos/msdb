import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PointsSystemComponent } from '../list/points-system.component';
import { PointsSystemDetailComponent } from '../detail/points-system-detail.component';
import { PointsSystemUpdateComponent } from '../update/points-system-update.component';
import { PointsSystemRoutingResolveService } from './points-system-routing-resolve.service';

const pointsSystemRoute: Routes = [
  {
    path: '',
    component: PointsSystemComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PointsSystemDetailComponent,
    resolve: {
      pointsSystem: PointsSystemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PointsSystemUpdateComponent,
    resolve: {
      pointsSystem: PointsSystemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PointsSystemUpdateComponent,
    resolve: {
      pointsSystem: PointsSystemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pointsSystemRoute)],
  exports: [RouterModule],
})
export class PointsSystemRoutingModule {}
