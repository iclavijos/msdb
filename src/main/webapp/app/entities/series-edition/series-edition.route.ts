import { NgModule, Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SeriesEdition } from 'app/shared/model/series-edition.model';
import { SeriesEditionService } from './series-edition.service';
import { SeriesEditionComponent } from './series-edition.component';
import { SeriesEditionDetailComponent } from './series-edition-detail.component';
// import { SeriesEditionUpdateComponent } from './series-edition-update.component';
// import { SeriesEditionDeletePopupComponent } from './series-edition-delete-dialog.component';
import { ISeriesEdition } from 'app/shared/model/series-edition.model';

@Injectable({ providedIn: 'root' })
export class SeriesEditionResolve implements Resolve<ISeriesEdition> {
  constructor(private service: SeriesEditionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISeriesEdition> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<SeriesEdition>) => response.ok),
        map((seriesEdition: HttpResponse<SeriesEdition>) => seriesEdition.body)
      );
    }
    return of(new SeriesEdition());
  }
}

const seriesEditionRoute: Routes = [
  {
    path: '',
    component: SeriesEditionComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: 'id,asc',
      pageTitle: 'motorsportsDatabaseApp.series.seriesEdition.detail.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: SeriesEditionDetailComponent,
    resolve: {
      seriesEdition: SeriesEditionResolve
    },
    data: {
      pageTitle: 'motorsportsDatabaseApp.series.seriesEdition.detail.title'
    },
    canActivate: [UserRouteAccessService]
  }
  //   {
  //     path: 'new',
  //     component: SeriesEditionUpdateComponent,
  //     resolve: {
  //       seriesEdition: SeriesEditionResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.seriesEdition.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   },
  //   {
  //     path: ':id/edit',
  //     component: SeriesEditionUpdateComponent,
  //     resolve: {
  //       seriesEdition: SeriesEditionResolve
  //     },
  //     data: {
  //       authorities: ['ROLE_USER'],
  //       pageTitle: 'motorsportsDatabaseApp.seriesEdition.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  //   }
];

// const seriesEditionPopupRoute: Routes = [
//   {
//     path: ':id/delete',
//     component: SeriesEditionDeletePopupComponent,
//     resolve: {
//       seriesEdition: SeriesEditionResolve
//     },
//     data: {
//       authorities: ['ROLE_USER'],
//       pageTitle: 'motorsportsDatabaseApp.seriesEdition.home.title'
//     },
//     canActivate: [UserRouteAccessService],
//     outlet: 'popup'
//   }
// ];

@NgModule({
  imports: [RouterModule.forChild(seriesEditionRoute)],
  exports: [RouterModule]
})
export class SeriesEditionRoutingModule {}
