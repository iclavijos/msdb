import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Series } from 'app/shared/model/series.model';
import { SeriesService } from './series.service';
import { SeriesComponent } from './series.component';
import { SeriesDetailComponent } from './series-detail.component';
import { SeriesUpdateComponent } from './series-update.component';
import { SeriesDeletePopupComponent } from './series-delete-dialog.component';
import { ISeries } from 'app/shared/model/series.model';

@Injectable({ providedIn: 'root' })
export class SeriesResolve implements Resolve<ISeries> {
    constructor(private service: SeriesService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISeries> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Series>) => response.ok),
                map((series: HttpResponse<Series>) => series.body)
            );
        }
        return of(new Series());
    }
}

export const seriesRoute: Routes = [
    {
        path: '',
        component: SeriesComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'motorsportsDatabaseApp.series.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: SeriesDetailComponent,
        resolve: {
            series: SeriesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.series.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: SeriesUpdateComponent,
        resolve: {
            series: SeriesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.series.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: SeriesUpdateComponent,
        resolve: {
            series: SeriesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.series.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const seriesPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: SeriesDeletePopupComponent,
        resolve: {
            series: SeriesResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.series.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
