import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { PointsSystemComponent } from './points-system.component';
import { PointsSystemDetailComponent } from './points-system-detail.component';
import { PointsSystemPopupComponent } from './points-system-dialog.component';
import { PointsSystemDeletePopupComponent } from './points-system-delete-dialog.component';

import { Principal } from '../../shared';


export const pointsSystemRoute: Routes = [
  {
    path: 'points-system',
    component: PointsSystemComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.pointsSystem.home.title'
    }
  }, {
    path: 'points-system/:id',
    component: PointsSystemDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.pointsSystem.home.title'
    }
  }
];

export const pointsSystemPopupRoute: Routes = [
  {
    path: 'points-system-new',
    component: PointsSystemPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.pointsSystem.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'points-system/:id/edit',
    component: PointsSystemPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.pointsSystem.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'points-system/:id/delete',
    component: PointsSystemDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.pointsSystem.home.title'
    },
    outlet: 'popup'
  }
];
