import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { EventEntryResult } from './event-entry-result.model';
import { EventEntryResultPopupService } from './event-entry-result-popup.service';
import { EventEntryResultService } from './event-entry-result.service';

@Component({
    selector: 'jhi-event-entry-result-dialog',
    templateUrl: './event-entry-result-dialog.component.html'
})
export class EventEntryResultDialogComponent implements OnInit {

    eventEntryResult: EventEntryResult;
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventEntryResultService: EventEntryResultService,
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
        if (this.eventEntryResult.id !== undefined) {
            this.subscribeToSaveResponse(
                this.eventEntryResultService.update(this.eventEntryResult), false);
        } else {
            this.subscribeToSaveResponse(
                this.eventEntryResultService.create(this.eventEntryResult), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<EventEntryResult>, isCreated: boolean) {
        result.subscribe((res: EventEntryResult) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: EventEntryResult, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'motorsportsDatabaseApp.eventEntryResult.created'
            : 'motorsportsDatabaseApp.eventEntryResult.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'eventEntryResultListModification', content: 'OK'});
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
    selector: 'jhi-event-entry-result-popup',
    template: ''
})
export class EventEntryResultPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private eventEntryResultPopupService: EventEntryResultPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.eventEntryResultPopupService
                    .open(EventEntryResultDialogComponent, params['id']);
            } else {
                this.modalRef = this.eventEntryResultPopupService
                    .open(EventEntryResultDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
