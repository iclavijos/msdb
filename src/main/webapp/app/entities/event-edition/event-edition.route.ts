import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventEdition } from 'app/shared/model/event-edition.model';
import { EventEditionService } from './event-edition.service';
import { EventEditionComponent } from './event-edition.component';
import { EventEditionDetailComponent } from './event-edition-detail.component';
import { EventEditionUpdateComponent } from './event-edition-update.component';
import { EventEditionDeletePopupComponent } from './event-edition-delete-dialog.component';
import { IEventEdition } from 'app/shared/model/event-edition.model';

@Injectable({ providedIn: 'root' })
export class EventEditionResolve implements Resolve<IEventEdition> {
    constructor(private service: EventEditionService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEventEdition> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<EventEdition>) => response.ok),
                map((eventEdition: HttpResponse<EventEdition>) => eventEdition.body)
            );
        }
        return of(new EventEdition());
    }
}

export const eventEditionRoute: Routes = [
    {
        path: '',
        component: EventEditionComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: EventEditionDetailComponent,
        resolve: {
            eventEdition: EventEditionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: EventEditionUpdateComponent,
        resolve: {
            eventEdition: EventEditionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: EventEditionUpdateComponent,
        resolve: {
            eventEdition: EventEditionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const eventEditionPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: EventEditionDeletePopupComponent,
        resolve: {
            eventEdition: EventEditionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
