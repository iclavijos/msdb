import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TyreProvider } from 'app/shared/model/tyre-provider.model';
import { TyreProviderService } from './tyre-provider.service';
import { TyreProviderComponent } from './tyre-provider.component';
import { TyreProviderDetailComponent } from './tyre-provider-detail.component';
import { TyreProviderUpdateComponent } from './tyre-provider-update.component';
import { TyreProviderDeletePopupComponent } from './tyre-provider-delete-dialog.component';
import { ITyreProvider } from 'app/shared/model/tyre-provider.model';

@Injectable({ providedIn: 'root' })
export class TyreProviderResolve implements Resolve<ITyreProvider> {
  constructor(private service: TyreProviderService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITyreProvider> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((tyreProvider: HttpResponse<TyreProvider>) => tyreProvider.body));
    }
    return of(new TyreProvider());
  }
}

export const tyreProviderRoute: Routes = [
  {
    path: '',
    component: TyreProviderComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'motorsportsDatabaseApp.tyreProvider.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: TyreProviderDetailComponent,
    resolve: {
      tyreProvider: TyreProviderResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.tyreProvider.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TyreProviderUpdateComponent,
    resolve: {
      tyreProvider: TyreProviderResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.tyreProvider.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: TyreProviderUpdateComponent,
    resolve: {
      tyreProvider: TyreProviderResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.tyreProvider.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const tyreProviderPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: TyreProviderDeletePopupComponent,
    resolve: {
      tyreProvider: TyreProviderResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.tyreProvider.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
