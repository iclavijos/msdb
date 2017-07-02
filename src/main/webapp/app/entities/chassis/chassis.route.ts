import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { ChassisComponent } from './chassis.component';
import { ChassisDetailComponent } from './chassis-detail.component';
import { ChassisPopupComponent } from './chassis-dialog.component';
import { ChassisDeletePopupComponent } from './chassis-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class ChassisResolvePagingParams implements Resolve<any> {

  constructor(private paginationUtil: PaginationUtil) {}

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

export const chassisRoute: Routes = [
  {
    path: 'chassis',
    component: ChassisComponent,
    resolve: {
      'pagingParams': ChassisResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
    }
  }, {
    path: 'chassis/:id',
    component: ChassisDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
    }
  }
];

export const chassisPopupRoute: Routes = [
  {
    path: 'chassis-new',
    component: ChassisPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'chassis/:id/edit',
    component: ChassisPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'chassis/:id/delete',
    component: ChassisDeletePopupComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
    },
    outlet: 'popup'
  }
];
