import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PointsSystem } from 'app/shared/model/points-system.model';
import { PointsSystemService } from './points-system.service';
import { PointsSystemComponent } from './points-system.component';
import { PointsSystemDetailComponent } from './points-system-detail.component';
import { PointsSystemUpdateComponent } from './points-system-update.component';
import { PointsSystemDeletePopupComponent } from './points-system-delete-dialog.component';
import { IPointsSystem } from 'app/shared/model/points-system.model';

@Injectable({ providedIn: 'root' })
export class PointsSystemResolve implements Resolve<IPointsSystem> {
  constructor(private service: PointsSystemService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPointsSystem> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<PointsSystem>) => response.ok),
        map((pointsSystem: HttpResponse<PointsSystem>) => pointsSystem.body)
      );
    }
    return of(new PointsSystem());
  }
}

export const pointsSystemRoute: Routes = [
  {
    path: '',
    component: PointsSystemComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      defaultSort: 'id,asc',
      pageTitle: 'motorsportsDatabaseApp.pointsSystem.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PointsSystemDetailComponent,
    resolve: {
      pointsSystem: PointsSystemResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.pointsSystem.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PointsSystemUpdateComponent,
    resolve: {
      pointsSystem: PointsSystemResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.pointsSystem.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PointsSystemUpdateComponent,
    resolve: {
      pointsSystem: PointsSystemResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.pointsSystem.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const pointsSystemPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: PointsSystemDeletePopupComponent,
    resolve: {
      pointsSystem: PointsSystemResolve
    },
    data: {
      authorities: ['ROLE_ADMIN'],
      pageTitle: 'motorsportsDatabaseApp.pointsSystem.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
