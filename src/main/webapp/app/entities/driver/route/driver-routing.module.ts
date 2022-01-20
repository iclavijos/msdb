import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DriverComponent } from '../list/driver.component';
import { DriverDetailComponent } from '../detail/driver-detail.component';
import { DriverUpdateComponent } from '../update/driver-update.component';
import { DriverRoutingResolveService } from './driver-routing-resolve.service';

const driverRoute: Routes = [
  {
    path: '',
    component: DriverComponent,
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'surname,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DriverDetailComponent,
    resolve: {
      driver: DriverRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DriverUpdateComponent,
    resolve: {
      driver: DriverRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DriverUpdateComponent,
    resolve: {
      driver: DriverRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
      pageTitle: 'motorsportsDatabaseApp.driver.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(driverRoute)],
  exports: [RouterModule],
})
export class DriverRoutingModule {}
