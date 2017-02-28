import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { TeamComponent } from './team.component';
import { TeamDetailComponent } from './team-detail.component';
import { TeamPopupComponent } from './team-dialog.component';
import { TeamDeletePopupComponent } from './team-delete-dialog.component';

import { Principal } from '../../shared';


export const teamRoute: Routes = [
  {
    path: 'team',
    component: TeamComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.team.home.title'
    }
  }, {
    path: 'team/:id',
    component: TeamDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.team.home.title'
    }
  }
];

export const teamPopupRoute: Routes = [
  {
    path: 'team-new',
    component: TeamPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.team.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'team/:id/edit',
    component: TeamPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.team.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'team/:id/delete',
    component: TeamDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'motorsportsDatabaseApp.team.home.title'
    },
    outlet: 'popup'
  }
];
