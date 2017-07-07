import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';

import { RacetrackLayoutComponent } from './racetrack-layout.component';
import { RacetrackLayoutDetailComponent } from './racetrack-layout-detail.component';
import { RacetrackLayoutPopupComponent } from './racetrack-layout-dialog.component';
import { RacetrackLayoutDeletePopupComponent } from './racetrack-layout-delete-dialog.component';

import { Principal } from '../../shared';


export const racetrackLayoutRoute: Routes = [
  {
    path: 'racetrack-layout',
    component: RacetrackLayoutComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
    }
  }, {
    path: 'racetrack/:id/racetrack-layout/:idLayout',
    component: RacetrackLayoutDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
    }
  }
];

export const racetrackLayoutPopupRoute: Routes = [
  {
    path: 'racetrack/:id/racetrack-layout-new',
    component: RacetrackLayoutPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'racetrack-layout/:id/edit',
    component: RacetrackLayoutPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'racetrack-layout/:id/delete',
    component: RacetrackLayoutDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
    },
    outlet: 'popup'
  }
];
