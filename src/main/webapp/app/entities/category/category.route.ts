import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Category } from 'app/shared/model/category.model';
import { CategoryService } from './category.service';
import { CategoryComponent } from './category.component';
import { CategoryDetailComponent } from './category-detail.component';
import { CategoryUpdateComponent } from './category-update.component';
import { CategoryDeletePopupComponent } from './category-delete-dialog.component';
import { ICategory } from 'app/shared/model/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryResolve implements Resolve<ICategory> {
  constructor(private service: CategoryService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICategory> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Category>) => response.ok),
        map((category: HttpResponse<Category>) => category.body)
      );
    }
    return of(new Category());
  }
}

export const categoryRoute: Routes = [
  {
    path: '',
    component: CategoryComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      defaultSort: 'id,asc',
      pageTitle: 'motorsportsDatabaseApp.category.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CategoryDetailComponent,
    resolve: {
      category: CategoryResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.category.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CategoryUpdateComponent,
    resolve: {
      category: CategoryResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.category.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CategoryUpdateComponent,
    resolve: {
      category: CategoryResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.category.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const categoryPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CategoryDeletePopupComponent,
    resolve: {
      category: CategoryResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.category.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
