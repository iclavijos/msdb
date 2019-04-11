import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackLayoutService } from './racetrack-layout.service';
import { RacetrackLayoutComponent } from './racetrack-layout.component';
import { RacetrackLayoutDetailComponent } from './racetrack-layout-detail.component';
import { RacetrackLayoutUpdateComponent } from './racetrack-layout-update.component';
import { RacetrackLayoutDeletePopupComponent } from './racetrack-layout-delete-dialog.component';
import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';

@Injectable({ providedIn: 'root' })
export class RacetrackLayoutResolve implements Resolve<IRacetrackLayout> {
    constructor(private service: RacetrackLayoutService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRacetrackLayout> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<RacetrackLayout>) => response.ok),
                map((racetrackLayout: HttpResponse<RacetrackLayout>) => racetrackLayout.body)
            );
        }
        return of(new RacetrackLayout());
    }
}

export const racetrackLayoutRoute: Routes = [
    {
        path: '',
        component: RacetrackLayoutComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: RacetrackLayoutDetailComponent,
        resolve: {
            racetrackLayout: RacetrackLayoutResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: RacetrackLayoutUpdateComponent,
        resolve: {
            racetrackLayout: RacetrackLayoutResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: RacetrackLayoutUpdateComponent,
        resolve: {
            racetrackLayout: RacetrackLayoutResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const racetrackLayoutPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: RacetrackLayoutDeletePopupComponent,
        resolve: {
            racetrackLayout: RacetrackLayoutResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
