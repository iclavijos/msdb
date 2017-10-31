import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventSessionService: EventSessionService,
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
        if (this.eventSession.id !== undefined) {
            this.subscribeToSaveResponse(
                this.eventSessionService.update(this.eventSession));
        } else {
            this.subscribeToSaveResponse(
                this.eventSessionService.create(this.eventSession));
        }
    }

    private subscribeToSaveResponse(result: Observable<EventSession>) {
        result.subscribe((res: EventSession) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: EventSession) {
        this.eventManager.broadcast({ name: 'eventSessionListModification', content: 'OK'});
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
    selector: 'jhi-event-session-popup',
    template: ''
})
export class EventSessionPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private eventSessionPopupService: EventSessionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.eventSessionPopupService
                    .open(EventSessionDialogComponent as Component, params['id']);
            } else {
                this.eventSessionPopupService
                    .open(EventSessionDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
