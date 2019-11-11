import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { RacetrackLayoutComponent } from './racetrack-layout.component';
import { RacetrackLayoutDetailComponent } from './racetrack-layout-detail.component';
import { RacetrackLayoutPopupComponent } from './racetrack-layout-dialog.component';
import { RacetrackLayoutDeletePopupComponent } from './racetrack-layout-delete-dialog.component';

export const racetrackLayoutRoute: Routes = [
    {
        path: 'racetrack-layout',
        component: RacetrackLayoutComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'racetrack-layout/:id',
        component: RacetrackLayoutDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const racetrackLayoutPopupRoute: Routes = [
    {
        path: 'racetrack-layout-new',
        component: RacetrackLayoutPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'racetrack-layout/:id/edit',
        component: RacetrackLayoutPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'racetrack-layout/:id/delete',
        component: RacetrackLayoutDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
