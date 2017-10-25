import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { RacetrackComponent } from './racetrack.component';
import { RacetrackDetailComponent } from './racetrack-detail.component';
import { RacetrackPopupComponent } from './racetrack-dialog.component';
import { RacetrackDeletePopupComponent } from './racetrack-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class RacetrackResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const racetrackRoute: Routes = [
    {
        path: 'racetrack',
        component: RacetrackComponent,
        resolve: {
            'pagingParams': RacetrackResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'racetrack/:id',
        component: RacetrackDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const racetrackPopupRoute: Routes = [
    {
        path: 'racetrack-new',
        component: RacetrackPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'racetrack/:id/edit',
        component: RacetrackPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'racetrack/:id/delete',
        component: RacetrackDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
