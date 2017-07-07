import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiLanguageService } from 'ng-jhipster';

import { EventSession } from './event-session.model';
import { EventSessionPopupService } from './event-session-popup.service';
import { EventSessionService } from './event-session.service';

import { DurationType, SessionType } from '../../shared';

@Component({
    selector: 'jhi-event-session-dialog',
    templateUrl: './event-session-dialog.component.html'
})
export class EventSessionDialogComponent implements OnInit {

    eventSession: EventSession;
    authorities: any[];
    isSaving: boolean;
    sessionTypes = SessionType;
    durationTypes = DurationType;
    keysSession: any[];
    keysDuration: any[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: JhiAlertService,
        private eventSessionService: EventSessionService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_EDITOR', 'ROLE_ADMIN'];
        
        this.keysDuration = Object.keys(this.durationTypes).filter(Number);
        this.keysSession = [0, 1, 2]; //Object.keys(this.sessionTypes).filter(key => parseInt(key)); Need to find out how not to filter out 0
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.eventSession.id !== undefined) {
            this.eventSessionService.update(this.eventSession)
                .subscribe((res: EventSession) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.eventSessionService.create(this.eventSession)
                .subscribe((res: EventSession) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: EventSession) {
        this.eventManager.broadcast({ name: 'eventSessionListModification', content: 'OK'});
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
}

@Component({
    selector: 'jhi-event-session-popup',
    template: ''
})
export class EventSessionPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;
    eventEditionId: number;

    constructor (
        private route: ActivatedRoute,
        private eventSessionPopupService: EventSessionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['idEdition']) {
                this.eventEditionId = params['idEdition'];
            }
            if ( params['id'] ) {
                this.modalRef = this.eventSessionPopupService
                    .open(EventSessionDialogComponent, params['id'], this.eventEditionId);
            } else {
                this.modalRef = this.eventSessionPopupService
                    .open(EventSessionDialogComponent, null, this.eventEditionId);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
