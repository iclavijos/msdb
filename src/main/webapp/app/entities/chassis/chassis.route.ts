import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ChassisComponent } from './chassis.component';
import { ChassisDetailComponent } from './chassis-detail.component';
import { ChassisPopupComponent } from './chassis-dialog.component';
import { ChassisDeletePopupComponent } from './chassis-delete-dialog.component';

@Injectable()
export class ChassisResolvePagingParams implements Resolve<any> {

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

export const chassisRoute: Routes = [
    {
        path: 'chassis',
        component: ChassisComponent,
        resolve: {
            'pagingParams': ChassisResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'chassis/:id',
        component: ChassisDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const chassisPopupRoute: Routes = [
    {
        path: 'chassis-new',
        component: ChassisPopupComponent,
        data: {
            authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
            pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'chassis/:id/edit',
        component: ChassisPopupComponent,
        data: {
            authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
            pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'chassis/:id/delete',
        component: ChassisDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
