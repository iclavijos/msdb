import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { TeamComponent } from './team.component';
import { TeamDetailComponent } from './team-detail.component';
import { TeamPopupComponent } from './team-dialog.component';
import { TeamDeletePopupComponent } from './team-delete-dialog.component';

@Injectable()
export class TeamResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'name,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const teamRoute: Routes = [
    {
        path: 'team',
        component: TeamComponent,
        resolve: {
            'pagingParams': TeamResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.team.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'team/:id',
        component: TeamDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.team.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const teamPopupRoute: Routes = [
    {
        path: 'team-new',
        component: TeamPopupComponent,
        data: {
            authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
            pageTitle: 'motorsportsDatabaseApp.team.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'team/:id/edit',
        component: TeamPopupComponent,
        data: {
            authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
            pageTitle: 'motorsportsDatabaseApp.team.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'team/:id/delete',
        component: TeamDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'motorsportsDatabaseApp.team.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
