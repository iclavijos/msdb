import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '../../core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Engine } from '../../shared/model/engine.model';
import { EngineService } from './engine.service';
import { EngineComponent } from './engine.component';
import { EngineDetailComponent } from './engine-detail.component';
import { EngineUpdateComponent } from './engine-update.component';
import { EngineDeletePopupComponent } from './engine-delete-dialog.component';
import { IEngine } from '../../shared/model/engine.model';

@Injectable({ providedIn: 'root' })
export class EngineResolve implements Resolve<IEngine> {
  constructor(private service: EngineService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEngine> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Engine>) => response.ok),
        map((engine: HttpResponse<Engine>) => engine.body)
      );
    }
    return of(new Engine());
  }
}

export const engineRoute: Routes = [
  {
    path: '',
    component: EngineComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'name,asc',
      pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: EngineDetailComponent,
    resolve: {
      engine: EngineResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: EngineUpdateComponent,
    resolve: {
      engine: EngineResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: EngineUpdateComponent,
    resolve: {
      engine: EngineResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const enginePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: EngineDeletePopupComponent,
    resolve: {
      engine: EngineResolve
    },
    data: {
      authorities: ['ROLE_ADMIN'],
      pageTitle: 'motorsportsDatabaseApp.engine.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
