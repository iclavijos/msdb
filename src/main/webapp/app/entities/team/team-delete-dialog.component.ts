import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITeam } from 'app/shared/model/team.model';
import { TeamService } from './team.service';

@Component({
    selector: 'jhi-team-delete-dialog',
    templateUrl: './team-delete-dialog.component.html'
})
export class TeamDeleteDialogComponent {
    team: ITeam;

    constructor(protected teamService: TeamService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.teamService.delete(id).subscribe(response => {
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
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ team }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TeamDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.team = team;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/team', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/team', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
