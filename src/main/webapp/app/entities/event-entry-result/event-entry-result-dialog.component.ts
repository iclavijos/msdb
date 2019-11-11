import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventEntryResultService: EventEntryResultService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.eventEntryResult.id !== undefined) {
            this.subscribeToSaveResponse(
                this.eventEntryResultService.update(this.eventEntryResult));
        } else {
            this.subscribeToSaveResponse(
                this.eventEntryResultService.create(this.eventEntryResult));
        }
    }

    private subscribeToSaveResponse(result: Observable<EventEntryResult>) {
        result.subscribe((res: EventEntryResult) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: EventEntryResult) {
        this.eventManager.broadcast({ name: 'eventEntryResultListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-event-entry-result-popup',
    template: ''
})
export class EventEntryResultPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private eventEntryResultPopupService: EventEntryResultPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.eventEntryResultPopupService
                    .open(EventEntryResultDialogComponent as Component, params['id']);
            } else {
                this.eventEntryResultPopupService
                    .open(EventEntryResultDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
