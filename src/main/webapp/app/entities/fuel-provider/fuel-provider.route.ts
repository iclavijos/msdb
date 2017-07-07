import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { FuelProviderComponent } from './fuel-provider.component';
import { FuelProviderDetailComponent } from './fuel-provider-detail.component';
import { FuelProviderPopupComponent } from './fuel-provider-dialog.component';
import { FuelProviderDeletePopupComponent } from './fuel-provider-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class FuelProviderResolvePagingParams implements Resolve<any> {

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

export const fuelProviderRoute: Routes = [
  {
    path: 'fuel-provider',
    component: FuelProviderComponent,
    resolve: {
      'pagingParams': FuelProviderResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    }
  }, {
    path: 'fuel-provider/:id',
    component: FuelProviderDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    }
  }
];

export const fuelProviderPopupRoute: Routes = [
  {
    path: 'fuel-provider-new',
    component: FuelProviderPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'fuel-provider/:id/edit',
    component: FuelProviderPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'fuel-provider/:id/delete',
    component: FuelProviderDeletePopupComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    },
    outlet: 'popup'
  }
];
