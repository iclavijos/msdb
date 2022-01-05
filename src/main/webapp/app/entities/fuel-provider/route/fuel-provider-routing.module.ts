import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FuelProviderComponent } from '../list/fuel-provider.component';
import { FuelProviderDetailComponent } from '../detail/fuel-provider-detail.component';
import { FuelProviderUpdateComponent } from '../update/fuel-provider-update.component';
import { FuelProviderRoutingResolveService } from './fuel-provider-routing-resolve.service';

const fuelProviderRoute: Routes = [
  {
    path: '',
    component: FuelProviderComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FuelProviderDetailComponent,
    resolve: {
      fuelProvider: FuelProviderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FuelProviderUpdateComponent,
    resolve: {
      fuelProvider: FuelProviderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FuelProviderUpdateComponent,
    resolve: {
      fuelProvider: FuelProviderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fuelProviderRoute)],
  exports: [RouterModule],
})
export class FuelProviderRoutingModule {}
