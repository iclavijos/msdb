import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiLanguageService, JhiDataUtils } from 'ng-jhipster';
import { Team } from './team.model';
import { TeamService } from './team.service';

@Component({
    selector: 'jhi-team-detail',
    templateUrl: './team-detail.component.html'
})
export class TeamDetailComponent implements OnInit, OnDestroy {

    team: Team;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: JhiDataUtils,
        private teamService: TeamService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.teamService.find(id).subscribe(team => {
            this.team = team;
        });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        this.router.navigate(['/team']);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
