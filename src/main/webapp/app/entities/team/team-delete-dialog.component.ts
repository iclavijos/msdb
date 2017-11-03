import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Team } from './team.model';
import { TeamPopupService } from './team-popup.service';
import { TeamService } from './team.service';

@Component({
    selector: 'jhi-team-delete-dialog',
    templateUrl: './team-delete-dialog.component.html'
})
export class TeamDeleteDialogComponent {

    team: Team;

    constructor(
        private teamService: TeamService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.teamService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'teamListModification',
                content: 'Deleted an team'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-team-delete-popup',
    template: ''
})
export class TeamDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private teamPopupService: TeamPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.teamPopupService
                .open(TeamDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
