import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { FuelProviderComponent } from './fuel-provider.component';
import { FuelProviderDetailComponent } from './fuel-provider-detail.component';
import { FuelProviderPopupComponent } from './fuel-provider-dialog.component';
import { FuelProviderDeletePopupComponent } from './fuel-provider-delete-dialog.component';

import { Principal } from '../../shared';


export const fuelProviderRoute: Routes = [
  {
    path: 'fuel-provider',
    component: FuelProviderComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    }
  }, {
    path: 'fuel-provider/:id',
    component: FuelProviderDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    }
  }
];

export const fuelProviderPopupRoute: Routes = [
  {
    path: 'fuel-provider-new',
    component: FuelProviderPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'fuel-provider/:id/edit',
    component: FuelProviderPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'fuel-provider/:id/delete',
    component: FuelProviderDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    },
    outlet: 'popup'
  }
];
