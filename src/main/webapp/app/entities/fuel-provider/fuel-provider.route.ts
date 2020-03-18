import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { FuelProvider } from 'app/shared/model/fuel-provider.model';
import { FuelProviderService } from './fuel-provider.service';
import { FuelProviderComponent } from './fuel-provider.component';
import { FuelProviderDetailComponent } from './fuel-provider-detail.component';
import { FuelProviderUpdateComponent } from './fuel-provider-update.component';
import { FuelProviderDeletePopupComponent } from './fuel-provider-delete-dialog.component';
import { IFuelProvider } from 'app/shared/model/fuel-provider.model';

@Injectable({ providedIn: 'root' })
export class FuelProviderResolve implements Resolve<IFuelProvider> {
  constructor(private service: FuelProviderService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IFuelProvider> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<FuelProvider>) => response.ok),
        map((fuelProvider: HttpResponse<FuelProvider>) => fuelProvider.body)
      );
    }
    return of(new FuelProvider());
  }
}

export const fuelProviderRoute: Routes = [
  {
    path: '',
    component: FuelProviderComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'name,asc',
      pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: FuelProviderDetailComponent,
    resolve: {
      fuelProvider: FuelProviderResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: FuelProviderUpdateComponent,
    resolve: {
      fuelProvider: FuelProviderResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: FuelProviderUpdateComponent,
    resolve: {
      fuelProvider: FuelProviderResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const fuelProviderPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: FuelProviderDeletePopupComponent,
    resolve: {
      fuelProvider: FuelProviderResolve
    },
    data: {
      authorities: ['ROLE_ADMIN'],
      pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
