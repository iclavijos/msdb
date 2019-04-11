import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { EventEntryComponent } from './event-entry.component';
import { EventEntryDetailComponent } from './event-entry-detail.component';
import { EventEntryPopupComponent } from './event-entry-dialog.component';
import { EventEntryDeletePopupComponent } from './event-entry-delete-dialog.component';

export const eventEntryRoute: Routes = [
    {
        path: 'event-entry',
        component: EventEntryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
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
        path: 'event-entry-new',
        component: EventEntryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'event-entry/:id/edit',
        component: EventEntryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'event-entry/:id/delete',
        component: EventEntryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
