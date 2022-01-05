import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SeriesEditionComponent } from '../list/series-edition.component';
import { SeriesEditionDetailComponent } from '../detail/series-edition-detail.component';
import { SeriesEditionUpdateComponent } from '../update/series-edition-update.component';
import { SeriesEditionRoutingResolveService } from './series-edition-routing-resolve.service';

const seriesEditionRoute: Routes = [
  {
    path: '',
    component: SeriesEditionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SeriesEditionDetailComponent,
    resolve: {
      seriesEdition: SeriesEditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SeriesEditionUpdateComponent,
    resolve: {
      seriesEdition: SeriesEditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SeriesEditionUpdateComponent,
    resolve: {
      seriesEdition: SeriesEditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(seriesEditionRoute)],
  exports: [RouterModule],
})
export class SeriesEditionRoutingModule {}
