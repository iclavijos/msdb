import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DriverPointsDetails } from 'app/shared/model/driver-points-details.model';
import { DriverPointsDetailsService } from './driver-points-details.service';
import { DriverPointsDetailsComponent } from './driver-points-details.component';
import { DriverPointsDetailsDetailComponent } from './driver-points-details-detail.component';
import { DriverPointsDetailsUpdateComponent } from './driver-points-details-update.component';
import { DriverPointsDetailsDeletePopupComponent } from './driver-points-details-delete-dialog.component';
import { IDriverPointsDetails } from 'app/shared/model/driver-points-details.model';

@Injectable({ providedIn: 'root' })
export class DriverPointsDetailsResolve implements Resolve<IDriverPointsDetails> {
  constructor(private service: DriverPointsDetailsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDriverPointsDetails> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<DriverPointsDetails>) => response.ok),
        map((driverPointsDetails: HttpResponse<DriverPointsDetails>) => driverPointsDetails.body)
      );
    }
    return of(new DriverPointsDetails());
  }
}

export const driverPointsDetailsRoute: Routes = [
  {
    path: '',
    component: DriverPointsDetailsComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DriverPointsDetailsDetailComponent,
    resolve: {
      driverPointsDetails: DriverPointsDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DriverPointsDetailsUpdateComponent,
    resolve: {
      driverPointsDetails: DriverPointsDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DriverPointsDetailsUpdateComponent,
    resolve: {
      driverPointsDetails: DriverPointsDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const driverPointsDetailsPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: DriverPointsDetailsDeletePopupComponent,
    resolve: {
      driverPointsDetails: DriverPointsDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
