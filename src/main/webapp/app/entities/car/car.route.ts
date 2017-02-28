import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { CarComponent } from './car.component';
import { CarDetailComponent } from './car-detail.component';
import { CarPopupComponent } from './car-dialog.component';
import { CarDeletePopupComponent } from './car-delete-dialog.component';

import { Principal } from '../../shared';


export const carRoute: Routes = [
  {
    path: 'car',
    component: CarComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.car.home.title'
    }
  }, {
    path: 'car/:id',
    component: CarDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.car.home.title'
    }
  }
];

export const carPopupRoute: Routes = [
  {
    path: 'car-new',
    component: CarPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.car.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'car/:id/edit',
    component: CarPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.car.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'car/:id/delete',
    component: CarDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.car.home.title'
    },
    outlet: 'popup'
  }
];
