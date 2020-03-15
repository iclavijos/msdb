import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackLayoutService } from './racetrack-layout.service';
import { RacetrackLayoutDetailComponent } from './racetrack-layout-detail.component';
import { RacetrackLayoutUpdateComponent } from './racetrack-layout-update.component';
import { RacetrackLayoutDeletePopupComponent } from './racetrack-layout-delete-dialog.component';
import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackService } from '../racetrack/racetrack.service';
import { IRacetrack, Racetrack } from 'app/shared/model/racetrack.model';

@Injectable({ providedIn: 'root' })
export class RacetrackLayoutResolve implements Resolve<IRacetrackLayout> {
  constructor(private service: RacetrackLayoutService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRacetrackLayout> {
    const id = route.params['id'];

    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<RacetrackLayout>) => response.ok),
        map((racetrackLayout: HttpResponse<RacetrackLayout>) => racetrackLayout.body)
      );
    }
    return of(new RacetrackLayout());
  }
}

@Injectable({ providedIn: 'root' })
export class RacetrackResolve implements Resolve<IRacetrack> {
  constructor(private rs: RacetrackService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRacetrack> {
    const id = route.paramMap.get('idRacetrack');

    return this.rs.find(+id).pipe(
      filter((response: HttpResponse<Racetrack>) => response.ok),
      map((racetrack: HttpResponse<Racetrack>) => racetrack.body)
    );
  }
}

export const racetrackLayoutRoute: Routes = [
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
    path: 'new/:idRacetrack',
    component: RacetrackLayoutUpdateComponent,
    resolve: {
      racetrackLayout: RacetrackLayoutResolve,
      racetrack: RacetrackResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
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
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
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
      authorities: ['ROLE_ADMIN'],
      pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
