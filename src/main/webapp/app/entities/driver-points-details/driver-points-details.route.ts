import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { DriverPointsDetailsComponent } from './driver-points-details.component';
import { DriverPointsDetailsDetailComponent } from './driver-points-details-detail.component';
import { DriverPointsDetailsPopupComponent } from './driver-points-details-dialog.component';
import { DriverPointsDetailsDeletePopupComponent } from './driver-points-details-delete-dialog.component';
import { DriverPointsSeriesPopupComponent } from './driver-points-series.component';

export const driverPointsDetailsRoute: Routes = [
    {
        path: 'driver-points-details',
        component: DriverPointsDetailsComponent,
        data: {
            pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'driver-points-details/:id',
        component: DriverPointsDetailsDetailComponent,
        data: {
            pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const driverPointsDetailsPopupRoute: Routes = [
    {
        path: ':eventEditionId/:driverId/driver-points-details-new',
        component: DriverPointsDetailsPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
            pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'driver-points-details/:id/delete',
        component: DriverPointsDetailsDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'driver-points-series',
        component: DriverPointsSeriesPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
