import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { RacetrackComponent } from './racetrack.component';
import { RacetrackDetailComponent } from './racetrack-detail.component';
import { RacetrackPopupComponent } from './racetrack-dialog.component';
import { RacetrackDeletePopupComponent } from './racetrack-delete-dialog.component';

import { RacetrackLayoutComponent } from '../racetrack-layout/racetrack-layout.component';
import { RacetrackLayoutDetailComponent } from '../racetrack-layout/racetrack-layout-detail.component';
import { RacetrackLayoutPopupComponent } from '../racetrack-layout/racetrack-layout-dialog.component';
import { RacetrackLayoutDeletePopupComponent } from '../racetrack-layout/racetrack-layout-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class RacetrackResolvePagingParams implements Resolve<any> {

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

export const racetrackRoute: Routes = [
  {
    path: 'racetrack',
    component: RacetrackComponent,
    resolve: {
      'pagingParams': RacetrackResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
    }
  }, {
    path: 'racetrack/:id',
    component: RacetrackDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
    }
  }
];

export const racetrackPopupRoute: Routes = [
  {
    path: 'racetrack-new',
    component: RacetrackPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'racetrack/:id/edit',
    component: RacetrackPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'racetrack/:id/delete',
    component: RacetrackDeletePopupComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
    },
    outlet: 'popup'
  }
];

export const racetrackLayoutRoute: Routes = [
     {
       path: 'racetrack-layout',
       component: RacetrackLayoutComponent,
       data: {
           authorities: ['ROLE_USER'],
           pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
       }
     }, {
       path: 'racetrack/:id/racetrack-layout/:idLayout',
       component: RacetrackLayoutDetailComponent,
       data: {
           authorities: ['ROLE_USER'],
           pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
       }
     }
   ];

export const racetrackLayoutPopupRoute: Routes = [
     {
       path: 'racetrack/:id/racetrack-layout-new',
   component: RacetrackLayoutPopupComponent,
   data: {
       authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
       pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
   },
   outlet: 'popup'
 },
 {
   path: 'racetrack/racetrack-layout/:id/edit',
   component: RacetrackLayoutPopupComponent,
   data: {
       authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
       pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
   },
   outlet: 'popup'
 },
 {
   path: 'racetrack/racetrack-layout/:id/delete',
   component: RacetrackLayoutDeletePopupComponent,
   data: {
       authorities: ['ROLE_ADMIN'],
       pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
   },
   outlet: 'popup'
     }
   ];
