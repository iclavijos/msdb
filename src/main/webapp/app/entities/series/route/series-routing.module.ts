import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SeriesComponent } from '../list/series.component';
import { SeriesDetailComponent } from '../detail/series-detail.component';
import { SeriesUpdateComponent } from '../update/series-update.component';
import { SeriesRoutingResolveService } from './series-routing-resolve.service';

const seriesRoute: Routes = [
  {
    path: '',
    component: SeriesComponent,
    data: {
      defaultSort: 'name,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SeriesDetailComponent,
    resolve: {
      series: SeriesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SeriesUpdateComponent,
    resolve: {
      series: SeriesRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: SeriesUpdateComponent,
    resolve: {
      series: SeriesRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(seriesRoute)],
  exports: [RouterModule],
})
export class SeriesRoutingModule {}
