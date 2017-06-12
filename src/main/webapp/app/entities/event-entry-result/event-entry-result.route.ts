import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { EventEntryResultComponent } from './event-entry-result.component';
import { EventEntryResultDetailComponent } from './event-entry-result-detail.component';
import { EventEntryResultPopupComponent } from './event-entry-result-dialog.component';
import { EventEntryUploadResultsPopupComponent } from './event-entry-upload-results-dialog.component';
import { EventEntryUploadLapByLapPopupComponent } from './event-entry-upload-lapbylap-dialog.component';
import { EventEntryResultDeletePopupComponent } from './event-entry-result-delete-dialog.component';

import { Principal } from '../../shared';


export const eventEntryResultRoute: Routes = [
  {
    path: 'event-entry-result',
    component: EventEntryResultComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
    }
  }, {
    path: 'event-entry-result/:id',
    component: EventEntryResultDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
    }
  }
];

export const eventEntryResultPopupRoute: Routes = [
  {
    path: ':idSession/event-entry-result-new',
    component: EventEntryResultPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
    },
    outlet: 'popup'
  },
  {
      path: ':id/upload-results',
      component: EventEntryUploadResultsPopupComponent,
      data: {
          authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
          pageTitle: 'motorsportsDatabaseApp.eventEntryResult.copy.title'
      },
      outlet: 'popup'
  },
  {
      path: ':id/upload-lapbylap',
      component: EventEntryUploadLapByLapPopupComponent,
      data: {
          authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
          pageTitle: 'motorsportsDatabaseApp.eventEntryResult.copy.title'
      },
      outlet: 'popup'
  },
  {
    path: 'event-entry-result/:id/edit',
    component: EventEntryResultPopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'event-entry-result/:id/delete',
    component: EventEntryResultDeletePopupComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
    },
    outlet: 'popup'
  }
];
