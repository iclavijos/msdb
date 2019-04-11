import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { EventSessionComponent } from './event-session.component';
import { EventSessionDetailComponent } from './event-session-detail.component';
import { EventSessionPopupComponent } from './event-session-dialog.component';
import { EventSessionDeletePopupComponent } from './event-session-delete-dialog.component';

export const eventSessionRoute: Routes = [
    {
        path: 'event-session',
        component: EventSessionComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventSession.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'event-session/:id',
        component: EventSessionDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventSession.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const eventSessionPopupRoute: Routes = [
    {
        path: 'event-session-new',
        component: EventSessionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventSession.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'event-session/:id/edit',
        component: EventSessionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventSession.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'event-session/:id/delete',
        component: EventSessionDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventSession.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
