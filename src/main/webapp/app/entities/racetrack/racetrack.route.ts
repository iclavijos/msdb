import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Racetrack } from 'app/shared/model/racetrack.model';
import { RacetrackService } from './racetrack.service';
import { RacetrackComponent } from './racetrack.component';
import { RacetrackDetailComponent } from './racetrack-detail.component';
import { RacetrackUpdateComponent } from './racetrack-update.component';
import { RacetrackDeletePopupComponent } from './racetrack-delete-dialog.component';
import { IRacetrack } from 'app/shared/model/racetrack.model';

@Injectable({ providedIn: 'root' })
export class RacetrackResolve implements Resolve<IRacetrack> {
    constructor(private service: RacetrackService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRacetrack> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Racetrack>) => response.ok),
                map((racetrack: HttpResponse<Racetrack>) => racetrack.body)
            );
        }
        return of(new Racetrack());
    }
}

export const racetrackRoute: Routes = [
    {
        path: '',
        component: RacetrackComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: RacetrackDetailComponent,
        resolve: {
            racetrack: RacetrackResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: RacetrackUpdateComponent,
        resolve: {
            racetrack: RacetrackResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: RacetrackUpdateComponent,
        resolve: {
            racetrack: RacetrackResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const racetrackPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: RacetrackDeletePopupComponent,
        resolve: {
            racetrack: RacetrackResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
