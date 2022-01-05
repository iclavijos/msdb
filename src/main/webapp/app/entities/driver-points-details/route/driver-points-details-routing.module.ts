import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DriverPointsDetailsComponent } from '../list/driver-points-details.component';
import { DriverPointsDetailsDetailComponent } from '../detail/driver-points-details-detail.component';
import { DriverPointsDetailsUpdateComponent } from '../update/driver-points-details-update.component';
import { DriverPointsDetailsRoutingResolveService } from './driver-points-details-routing-resolve.service';

const driverPointsDetailsRoute: Routes = [
  {
    path: '',
    component: DriverPointsDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DriverPointsDetailsDetailComponent,
    resolve: {
      driverPointsDetails: DriverPointsDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DriverPointsDetailsUpdateComponent,
    resolve: {
      driverPointsDetails: DriverPointsDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DriverPointsDetailsUpdateComponent,
    resolve: {
      driverPointsDetails: DriverPointsDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(driverPointsDetailsRoute)],
  exports: [RouterModule],
})
export class DriverPointsDetailsRoutingModule {}
