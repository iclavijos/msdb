import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Route, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { HomeComponent } from './home.component';
import { HomeEntriesComponent } from './home-entries.component';
import { HomeEventsComponent } from './home-events.component';

@Injectable()
export class HomeEntriesResolvePagingParams implements Resolve<any> {

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

export const HOME_ROUTE: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            authorities: [],
            pageTitle: 'home.title'
        }
    },
    {
        path: 'homeEntries',
        component: HomeEntriesComponent,
        resolve: {
            'pagingParams': HomeEntriesResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'home.entriesResult'
        }
    },
    {
        path: 'homeEvents',
        component: HomeEventsComponent,
        resolve: {
            'pagingParams': HomeEntriesResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'home.eventsResult'
        }
    }
];
