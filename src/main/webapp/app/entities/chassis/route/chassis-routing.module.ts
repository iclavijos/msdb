import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChassisComponent } from '../list/chassis.component';
import { ChassisDetailComponent } from '../detail/chassis-detail.component';
import { ChassisUpdateComponent } from '../update/chassis-update.component';
import { ChassisRoutingResolveService } from './chassis-routing-resolve.service';

const chassisRoute: Routes = [
  {
    path: '',
    component: ChassisComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChassisDetailComponent,
    resolve: {
      chassis: ChassisRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChassisUpdateComponent,
    resolve: {
      chassis: ChassisRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChassisUpdateComponent,
    resolve: {
      chassis: ChassisRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chassisRoute)],
  exports: [RouterModule],
})
export class ChassisRoutingModule {}
