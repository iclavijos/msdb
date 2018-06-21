import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { EventEntryResultComponent } from './event-entry-result.component';
import { EventEntryResultDetailComponent } from './event-entry-result-detail.component';
import { EventEntryResultPopupComponent } from './event-entry-result-dialog.component';
import { EventEntryResultDeletePopupComponent } from './event-entry-result-delete-dialog.component';

export const eventEntryResultRoute: Routes = [
    {
        path: 'event-entry-result',
        component: EventEntryResultComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'event-entry-result/:id',
        component: EventEntryResultDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const eventEntryResultPopupRoute: Routes = [
    {
        path: 'event-entry-result-new',
        component: EventEntryResultPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'event-entry-result/:id/edit',
        component: EventEntryResultPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'event-entry-result/:id/delete',
        component: EventEntryResultDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
