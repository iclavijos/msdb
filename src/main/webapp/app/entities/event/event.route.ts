import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { EventComponent } from './event.component';
import { EventDetailComponent } from './event-detail.component';
import { EventPopupComponent } from './event-dialog.component';
import { EventDeletePopupComponent } from './event-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class EventResolvePagingParams implements Resolve<any> {

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

export const eventRoute: Routes = [
  {
    path: 'event',
    component: EventComponent,
    resolve: {
      'pagingParams': EventResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.event.home.title'
    }
  }, {
    path: 'event/:id',
    component: EventDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.event.home.title'
    }
  }
];

export const eventPopupRoute: Routes = [
  {
    path: 'event-new',
    component: EventPopupComponent,
    data: {
        authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
        pageTitle: 'motorsportsDatabaseApp.event.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'event/:id/edit',
    component: EventPopupComponent,
    data: {
        authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
        pageTitle: 'motorsportsDatabaseApp.event.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'event/:id/delete',
    component: EventDeletePopupComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.event.home.title'
    },
    outlet: 'popup'
  }
];
