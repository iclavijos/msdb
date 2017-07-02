import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { EngineComponent } from './engine.component';
import { EngineDetailComponent } from './engine-detail.component';
import { EnginePopupComponent } from './engine-dialog.component';
import { EngineDeletePopupComponent } from './engine-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class EngineResolvePagingParams implements Resolve<any> {

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

export const engineRoute: Routes = [
  {
    path: 'engine',
    component: EngineComponent,
    resolve: {
       'pagingParams': EngineResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    }
  }, {
    path: 'engine/:id',
    component: EngineDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    }
  }
];

export const enginePopupRoute: Routes = [
  {
    path: 'engine-new',
    component: EnginePopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'engine/:id/edit',
    component: EnginePopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'engine/:id/delete',
    component: EngineDeletePopupComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    },
    outlet: 'popup'
  }
];
