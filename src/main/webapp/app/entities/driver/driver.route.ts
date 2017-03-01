import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { DriverComponent } from './driver.component';
import { DriverDetailComponent } from './driver-detail.component';
import { DriverPopupComponent } from './driver-dialog.component';
import { DriverDeletePopupComponent } from './driver-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class DriverResolvePagingParams implements Resolve<any> {

  constructor(private paginationUtil: PaginationUtil) {}

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

export const driverRoute: Routes = [
  {
    path: 'driver',
    component: DriverComponent,
    resolve: {
      'pagingParams': DriverResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.driver.home.title'
    }
  }, {
    path: 'driver/:id',
    component: DriverDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.driver.home.title'
    }
  }
];

export const driverPopupRoute: Routes = [
  {
    path: 'driver-new',
    component: DriverPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.driver.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'driver/:id/edit',
    component: DriverPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.driver.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'driver/:id/delete',
    component: DriverDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.driver.home.title'
    },
    outlet: 'popup'
  }
];
