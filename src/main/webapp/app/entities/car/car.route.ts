import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { CarComponent } from './car.component';
import { CarDetailComponent } from './car-detail.component';
import { CarPopupComponent } from './car-dialog.component';
import { CarDeletePopupComponent } from './car-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class CarResolvePagingParams implements Resolve<any> {

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

export const carRoute: Routes = [
  {
    path: 'car',
    component: CarComponent,
    resolve: {
      'pagingParams': CarResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.car.home.title'
    }
  }, {
    path: 'car/:id',
    component: CarDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.car.home.title'
    }
  }
];

export const carPopupRoute: Routes = [
  {
    path: 'car-new',
    component: CarPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.car.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'car/:id/edit',
    component: CarPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.car.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'car/:id/delete',
    component: CarDeletePopupComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.car.home.title'
    },
    outlet: 'popup'
  }
];
