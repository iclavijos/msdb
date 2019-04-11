import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Chassis } from 'app/shared/model/chassis.model';
import { ChassisService } from './chassis.service';
import { ChassisComponent } from './chassis.component';
import { ChassisDetailComponent } from './chassis-detail.component';
import { ChassisUpdateComponent } from './chassis-update.component';
import { ChassisDeletePopupComponent } from './chassis-delete-dialog.component';
import { IChassis } from 'app/shared/model/chassis.model';

@Injectable({ providedIn: 'root' })
export class ChassisResolve implements Resolve<IChassis> {
    constructor(private service: ChassisService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChassis> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Chassis>) => response.ok),
                map((chassis: HttpResponse<Chassis>) => chassis.body)
            );
        }
        return of(new Chassis());
    }
}

export const chassisRoute: Routes = [
    {
        path: '',
        component: ChassisComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ChassisDetailComponent,
        resolve: {
            chassis: ChassisResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ChassisUpdateComponent,
        resolve: {
            chassis: ChassisResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ChassisUpdateComponent,
        resolve: {
            chassis: ChassisResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const chassisPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ChassisDeletePopupComponent,
        resolve: {
            chassis: ChassisResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.chassis.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
