import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

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
        private alertService: JhiAlertService,
        private eventSessionService: EventSessionService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.eventSession.id !== undefined) {
            this.subscribeToSaveResponse(
                this.eventSessionService.update(this.eventSession), false);
        } else {
            this.subscribeToSaveResponse(
                this.eventSessionService.create(this.eventSession), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<EventSession>, isCreated: boolean) {
        result.subscribe((res: EventSession) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: EventSession, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'motorsportsDatabaseApp.eventSession.created'
            : 'motorsportsDatabaseApp.eventSession.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'eventSessionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
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

    constructor(
        private route: ActivatedRoute,
        private eventSessionPopupService: EventSessionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
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
