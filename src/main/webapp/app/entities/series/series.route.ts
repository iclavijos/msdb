import { NgModule, Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '../../core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SeriesService } from './series.service';
import { SeriesComponent } from './series.component';
import { SeriesDetailComponent } from './series-detail.component';
import { SeriesUpdateComponent } from './series-update.component';
import { SeriesDeletePopupComponent } from './series-delete-dialog.component';
import { ISeries, Series } from '../../shared/model/series.model';

@Injectable({ providedIn: 'root' })
export class SeriesResolve implements Resolve<ISeries> {
  constructor(private service: SeriesService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISeries> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ISeries>) => response.ok),
        map((series: HttpResponse<ISeries>) => series.body)
      );
    }
    return of(new Series());
  }
}

const seriesRoute: Routes = [
  {
    path: '',
    component: SeriesComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: 'id,asc',
      pageTitle: 'motorsportsDatabaseApp.series.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: SeriesDetailComponent,
    resolve: {
      series: SeriesResolve
    },
    data: {
      pageTitle: 'motorsportsDatabaseApp.series.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: SeriesUpdateComponent,
    resolve: {
      series: SeriesResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.series.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: SeriesUpdateComponent,
    resolve: {
      series: SeriesResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.series.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/delete',
    component: SeriesDeletePopupComponent,
    resolve: {
      series: SeriesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.series.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'edition',
    loadChildren: () => import('../series-edition/series-edition.module').then(m => m.MotorsportsDatabaseSeriesEditionModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(seriesRoute)],
  exports: [RouterModule]
})
export class SeriesRoutingModule {}
