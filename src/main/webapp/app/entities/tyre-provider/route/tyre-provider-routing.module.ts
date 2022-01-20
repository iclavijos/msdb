import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TyreProviderComponent } from '../list/tyre-provider.component';
import { TyreProviderDetailComponent } from '../detail/tyre-provider-detail.component';
import { TyreProviderUpdateComponent } from '../update/tyre-provider-update.component';
import { TyreProviderRoutingResolveService } from './tyre-provider-routing-resolve.service';

const tyreProviderRoute: Routes = [
  {
    path: '',
    component: TyreProviderComponent,
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'name,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TyreProviderDetailComponent,
    resolve: {
      tyreProvider: TyreProviderRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TyreProviderUpdateComponent,
    resolve: {
      tyreProvider: TyreProviderRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TyreProviderUpdateComponent,
    resolve: {
      tyreProvider: TyreProviderRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tyreProviderRoute)],
  exports: [RouterModule],
})
export class TyreProviderRoutingModule {}
