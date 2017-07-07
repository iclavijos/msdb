import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { EventEditionComponent } from './event-edition.component';
import { EventEditionDetailComponent } from './event-edition-detail.component';
import { EventEditionPopupComponent } from './event-edition-dialog.component';
import { EventEditionCopyEntriesPopupComponent } from './event-edition-copy-entries-dialog.component';
import { EventEditionDeletePopupComponent } from './event-edition-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class EventEditionResolvePagingParams implements Resolve<any> {

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

export const eventEditionRoute: Routes = [
  {
    path: 'event-edition/:id',
    component: EventEditionDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
    }
  }
];

export const eventEditionPopupRoute: Routes = [
  {
    path: 'event-edition-new',
    component: EventEditionPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
    },
    outlet: 'popup'
  },
  {
      path: ':id/copy-entries',
      component: EventEditionCopyEntriesPopupComponent,
      data: {
          authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
          pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
      },
      outlet: 'popup'
    },
  {
    path: 'event-edition/:id/edit',
    component: EventEditionPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'event-edition/:id/delete',
    component: EventEditionDeletePopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
    },
    outlet: 'popup'
  }
];
