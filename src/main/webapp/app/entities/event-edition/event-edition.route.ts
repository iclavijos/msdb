import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { EventEditionComponent } from './event-edition.component';
import { EventEditionDetailComponent } from './event-edition-detail.component';
import { EventEditionPopupComponent } from './event-edition-dialog.component';
import { EventEditionDeletePopupComponent } from './event-edition-delete-dialog.component';

import { Principal } from '../../shared';


export const eventEditionRoute: Routes = [
  {
    path: 'event-edition',
    component: EventEditionComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
    }
  }, {
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
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'event-edition/:id/edit',
    component: EventEditionPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'event-edition/:id/delete',
    component: EventEditionDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
    },
    outlet: 'popup'
  }
];
