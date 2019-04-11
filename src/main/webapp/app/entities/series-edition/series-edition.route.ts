import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SeriesEdition } from 'app/shared/model/series-edition.model';
import { SeriesEditionService } from './series-edition.service';
import { SeriesEditionComponent } from './series-edition.component';
import { SeriesEditionDetailComponent } from './series-edition-detail.component';
import { SeriesEditionUpdateComponent } from './series-edition-update.component';
import { SeriesEditionDeletePopupComponent } from './series-edition-delete-dialog.component';
import { ISeriesEdition } from 'app/shared/model/series-edition.model';

@Injectable({ providedIn: 'root' })
export class SeriesEditionResolve implements Resolve<ISeriesEdition> {
    constructor(private service: SeriesEditionService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISeriesEdition> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<SeriesEdition>) => response.ok),
                map((seriesEdition: HttpResponse<SeriesEdition>) => seriesEdition.body)
            );
        }
        return of(new SeriesEdition());
    }
}

export const seriesEditionRoute: Routes = [
    {
        path: '',
        component: SeriesEditionComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'motorsportsDatabaseApp.seriesEdition.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: SeriesEditionDetailComponent,
        resolve: {
            seriesEdition: SeriesEditionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.seriesEdition.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: SeriesEditionUpdateComponent,
        resolve: {
            seriesEdition: SeriesEditionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.seriesEdition.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: SeriesEditionUpdateComponent,
        resolve: {
            seriesEdition: SeriesEditionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.seriesEdition.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const seriesEditionPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: SeriesEditionDeletePopupComponent,
        resolve: {
            seriesEdition: SeriesEditionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.seriesEdition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
