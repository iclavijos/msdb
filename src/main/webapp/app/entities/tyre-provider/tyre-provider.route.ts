import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { TyreProviderComponent } from './tyre-provider.component';
import { TyreProviderDetailComponent } from './tyre-provider-detail.component';
import { TyreProviderPopupComponent } from './tyre-provider-dialog.component';
import { TyreProviderDeletePopupComponent } from './tyre-provider-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class TyreProviderResolvePagingParams implements Resolve<any> {

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

export const tyreProviderRoute: Routes = [
  {
    path: 'tyre-provider',
    component: TyreProviderComponent,
    resolve: {
      'pagingParams': TyreProviderResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.tyreProvider.home.title'
    }
  }, {
    path: 'tyre-provider/:id',
    component: TyreProviderDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.tyreProvider.home.title'
    }
  }
];

export const tyreProviderPopupRoute: Routes = [
  {
    path: 'tyre-provider-new',
    component: TyreProviderPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.tyreProvider.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'tyre-provider/:id/edit',
    component: TyreProviderPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.tyreProvider.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'tyre-provider/:id/delete',
    component: TyreProviderDeletePopupComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.tyreProvider.home.title'
    },
    outlet: 'popup'
  }
];
