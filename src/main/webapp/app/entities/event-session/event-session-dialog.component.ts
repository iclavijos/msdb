import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { EventSession } from './event-session.model';
import { EventSessionPopupService } from './event-session-popup.service';
import { EventSessionService } from './event-session.service';
@Component({
    selector: 'jhi-event-session-dialog',
    templateUrl: './event-session-dialog.component.html'
})
export class EventSessionDialogComponent implements OnInit {

    eventSession: EventSession;
    authorities: any[];
    isSaving: boolean;
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private eventSessionService: EventSessionService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['eventSession']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
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

    constructor (
        private route: ActivatedRoute,
        private eventSessionPopupService: EventSessionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.eventSessionPopupService
                    .open(EventSessionDialogComponent, params['id']);
            } else {
                this.modalRef = this.eventSessionPopupService
                    .open(EventSessionDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
