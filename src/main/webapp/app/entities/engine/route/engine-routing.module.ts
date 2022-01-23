import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EngineComponent } from '../list/engine.component';
import { EngineDetailComponent } from '../detail/engine-detail.component';
import { EngineUpdateComponent } from '../update/engine-update.component';
import { EngineRoutingResolveService } from './engine-routing-resolve.service';

const engineRoute: Routes = [
  {
    path: '',
    component: EngineComponent,
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'name,asc'
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EngineDetailComponent,
    resolve: {
      engine: EngineRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: EngineUpdateComponent,
    resolve: {
      engine: EngineRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: EngineUpdateComponent,
    resolve: {
      engine: EngineRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(engineRoute)],
  exports: [RouterModule],
})
export class EngineRoutingModule {}
