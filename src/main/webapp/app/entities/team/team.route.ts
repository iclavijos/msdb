import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { TeamComponent } from './team.component';
import { TeamDetailComponent } from './team-detail.component';
import { TeamPopupComponent } from './team-dialog.component';
import { TeamDeletePopupComponent } from './team-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class TeamResolvePagingParams implements Resolve<any> {

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

export const teamRoute: Routes = [
  {
    path: 'team',
    component: TeamComponent,
    resolve: {
      'pagingParams': TeamResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.team.home.title'
    }
  }, {
    path: 'team/:id',
    component: TeamDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.team.home.title'
    }
  }
];

export const teamPopupRoute: Routes = [
  {
    path: 'team-new',
    component: TeamPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.team.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'team/:id/edit',
    component: TeamPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.team.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'team/:id/delete',
    component: TeamDeletePopupComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.team.home.title'
    },
    outlet: 'popup'
  }
];
