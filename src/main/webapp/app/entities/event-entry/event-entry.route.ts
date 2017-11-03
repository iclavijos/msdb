import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { EventEntryDetailComponent } from './event-entry-detail.component';
import { EventEntryPopupComponent } from './event-entry-dialog.component';
import { EventEntryDeletePopupComponent } from './event-entry-delete-dialog.component';

import { Principal } from '../../shared';


export const eventEntryRoute: Routes = [
  {
    path: 'event-entry/:id',
    component: EventEntryDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
    },
        canActivate: [UserRouteAccessService]
  }
];

export const eventEntryPopupRoute: Routes = [
  {
    path: ':idEdition/event-entry-new',
    component: EventEntryPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
    },
        canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'event-entry/:id/edit',
    component: EventEntryPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
    },
        canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'event-entry/:id/delete',
    component: EventEntryDeletePopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
    },
        canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
