import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '../../core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Team } from '../../shared/model/team.model';
import { TeamService } from './team.service';
import { TeamComponent } from './team.component';
import { TeamDetailComponent } from './team-detail.component';
import { TeamUpdateComponent } from './team-update.component';
import { TeamDeletePopupComponent } from './team-delete-dialog.component';
import { ITeam } from '../../shared/model/team.model';

@Injectable({ providedIn: 'root' })
export class TeamResolve implements Resolve<ITeam> {
  constructor(private service: TeamService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITeam> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Team>) => response.ok),
        map((team: HttpResponse<Team>) => team.body)
      );
    }
    return of(new Team());
  }
}

export const teamRoute: Routes = [
  {
    path: '',
    component: TeamComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'name,asc',
      pageTitle: 'motorsportsDatabaseApp.team.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: TeamDetailComponent,
    resolve: {
      team: TeamResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'motorsportsDatabaseApp.team.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TeamUpdateComponent,
    resolve: {
      team: TeamResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.team.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: TeamUpdateComponent,
    resolve: {
      team: TeamResolve
    },
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_EDITOR'],
      pageTitle: 'motorsportsDatabaseApp.team.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const teamPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: TeamDeletePopupComponent,
    resolve: {
      team: TeamResolve
    },
    data: {
      authorities: ['ROLE_ADMIN'],
      pageTitle: 'motorsportsDatabaseApp.team.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
