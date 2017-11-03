import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

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
    isRaceAndLaps = false;
    private selectedType = 0;
    private selectedDuration = 0;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
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
      
        if (this.eventSession) {
          this.eventSession.sessionType = SessionType[SessionType[this.eventSession.sessionTypeValue]];
          this.selectedDuration = this.eventSession.durationType;
          this.selectedType = this.eventSession.sessionTypeValue;
          this.isRaceAndLaps = (this.selectedType === 2 && this.selectedDuration === 5);
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    private onChangeType(event) {
      this.selectedType = parseInt(event.target.value);
      this.isRaceAndLaps = (this.selectedType === 2 && this.selectedDuration === 5);
    }

    private onChangeDuration(event) {
      this.selectedDuration = parseInt(event.target.value);
      this.isRaceAndLaps = (this.selectedType === 2 && this.selectedDuration === 5);
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
    eventEditionId: number;

    constructor(
        private route: ActivatedRoute,
        private eventSessionPopupService: EventSessionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if (params['idEdition']) {
                this.eventEditionId = params['idEdition'];
            }
            if ( params['id'] ) {
                this.eventSessionPopupService
                    .open(EventSessionDialogComponent as Component, params['id'], this.eventEditionId);
            } else {
                this.eventSessionPopupService
                    .open(EventSessionDialogComponent as Component, null, this.eventEditionId);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
