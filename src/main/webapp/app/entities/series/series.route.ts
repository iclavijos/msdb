import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { SeriesComponent } from './series.component';
import { SeriesDetailComponent } from './series-detail.component';
import { SeriesPopupComponent } from './series-dialog.component';
import { SeriesDeletePopupComponent } from './series-delete-dialog.component';

@Injectable()
export class SeriesResolvePagingParams implements Resolve<any> {

  constructor(private paginationUtil: JhiPaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      let page = route.queryParams['page'] ? route.queryParams['page'] : '1';
      let sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'name,asc';
      return {
          page: this.paginationUtil.parsePage(page),
          predicate: this.paginationUtil.parsePredicate(sort),
          ascending: this.paginationUtil.parseAscending(sort)
    };
  }
}

@Injectable()
export class SeriesEditionResolvePagingParams implements Resolve<any> {

  constructor(private paginationUtil: JhiPaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      let page = route.queryParams['page'] ? route.queryParams['page'] : '1';
      let sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
      return {
          page: this.paginationUtil.parsePage(page),
          predicate: this.paginationUtil.parsePredicate(sort),
          ascending: this.paginationUtil.parseAscending(sort)
    };
  }
}

export const seriesRoute: Routes = [
  {
    path: 'series',
    component: SeriesComponent,
    resolve: {
      'pagingParams': SeriesResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.series.home.title'
    }
  }, {
    path: 'series/:id',
    component: SeriesDetailComponent,
    resolve: {
        'pagingParams': SeriesEditionResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.series.home.title'
    }
  }
];

export const seriesPopupRoute: Routes = [
  {
    path: 'series-new',
    component: SeriesPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.series.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'series/:id/edit',
    component: SeriesPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.series.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'series/:id/delete',
    component: SeriesDeletePopupComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.series.home.title'
    },
    outlet: 'popup'
  }
];
