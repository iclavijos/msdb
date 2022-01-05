import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITeam, Team } from '../team.model';
import { TeamService } from '../service/team.service';

@Injectable({ providedIn: 'root' })
export class TeamRoutingResolveService implements Resolve<ITeam> {
  constructor(protected service: TeamService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITeam> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((team: HttpResponse<Team>) => {
          if (team.body) {
            return of(team.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Team());
  }
}
