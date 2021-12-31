import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '../../core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Racetrack } from '../../shared/model/racetrack.model';
import { RacetrackService } from './racetrack.service';
import { RacetrackComponent } from './racetrack.component';
import { RacetrackDetailComponent } from './racetrack-detail.component';
import { RacetrackUpdateComponent } from './racetrack-update.component';
import { RacetrackDeletePopupComponent } from './racetrack-delete-dialog.component';
import { IRacetrack } from '../../shared/model/racetrack.model';

@Injectable({ providedIn: 'root' })
export class RacetrackResolve implements Resolve<IRacetrack> {
  constructor(private service: RacetrackService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRacetrack> {
    const id = route.params['id'];
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
      defaultSort: 'name,asc',
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
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
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
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
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
      authorities: ['ROLE_ADMIN'],
      pageTitle: 'motorsportsDatabaseApp.racetrack.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
