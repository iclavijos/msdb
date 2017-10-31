import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { DriverPointsDetailsComponent } from './driver-points-details.component';
import { DriverPointsDetailsDetailComponent } from './driver-points-details-detail.component';
import { DriverPointsDetailsPopupComponent } from './driver-points-details-dialog.component';
import { DriverPointsDetailsDeletePopupComponent } from './driver-points-details-delete-dialog.component';

export const driverPointsDetailsRoute: Routes = [
    {
        path: 'driver-points-details',
        component: DriverPointsDetailsComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'driver-points-details/:id',
        component: DriverPointsDetailsDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const driverPointsDetailsPopupRoute: Routes = [
    {
        path: 'driver-points-details-new',
        component: DriverPointsDetailsPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'driver-points-details/:id/edit',
        component: DriverPointsDetailsPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'driver-points-details/:id/delete',
        component: DriverPointsDetailsDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
