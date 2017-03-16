import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService, DataUtils } from 'ng-jhipster';

import { Team } from './team.model';
import { TeamPopupService } from './team-popup.service';
import { TeamService } from './team.service';

@Component({
    selector: 'jhi-team-dialog',
    templateUrl: './team-dialog.component.html'
})
export class TeamDialogComponent implements OnInit {

    team: Team;
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private alertService: AlertService,
        private teamService: TeamService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['team']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }
    
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData($event, team, field, isImage) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];
            if (isImage && !/^image\//.test($file.type)) {
                return;
            }
            this.dataUtils.toBase64($file, (base64Data) => {
                team[field] = base64Data;
                team[`${field}ContentType`] = $file.type;
            });
        }
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.team.id !== undefined) {
            this.teamService.update(this.team)
                .subscribe((res: Team) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.teamService.create(this.team)
                .subscribe((res: Team) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Team) {
        this.eventManager.broadcast({ name: 'teamListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-team-popup',
    template: ''
})
export class TeamPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private teamPopupService: TeamPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.teamPopupService
                    .open(TeamDialogComponent, params['id']);
            } else {
                this.modalRef = this.teamPopupService
                    .open(TeamDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
