import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { EngineComponent } from './engine.component';
import { EngineDetailComponent } from './engine-detail.component';
import { EnginePopupComponent } from './engine-dialog.component';
import { EngineDeletePopupComponent } from './engine-delete-dialog.component';

import { Principal } from '../../shared';


export const engineRoute: Routes = [
  {
    path: 'engine',
    component: EngineComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    }
  }, {
    path: 'engine/:id',
    component: EngineDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    }
  }
];

export const enginePopupRoute: Routes = [
  {
    path: 'engine-new',
    component: EnginePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'engine/:id/edit',
    component: EnginePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'engine/:id/delete',
    component: EngineDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    },
    outlet: 'popup'
  }
];
