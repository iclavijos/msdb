import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { EventEntry, EventEntryService } from '../event-entry';
import { EventEntryResult } from './event-entry-result.model';
import { EventEntryResultPopupService } from './event-entry-result-popup.service';
import { EventEntryResultService } from './event-entry-result.service';
import { EventSessionService } from '../event-session';

import { SessionType } from '../../shared/enumerations/sessionType.enum';

@Component({
    selector: 'jhi-event-entry-result-dialog',
    templateUrl: './event-entry-result-dialog.component.html'
})
export class EventEntryResultDialogComponent implements OnInit {

    eventEntryResult: EventEntryResult;
    authorities: any[];
    isSaving: boolean;
    entries: EventEntry[];
    rawLapTime: number;
    rawTotalTime: number;
    rawDifference: number;
    sessionType = SessionType;
    private eventEditionId;
    private positions: number[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private eventEntryService: EventEntryService,
        private eventEntryResultService: EventEntryResultService,
        private eventSessionService: EventSessionService,
        private eventManager: EventManager,
        private route: ActivatedRoute,
        private router: Router
    ) {
        //this.jhiLanguageService.setLocations(['eventEntryResult']);
    }

    ngOnInit() {
        this.eventSessionService.find(this.eventEntryResult.session.id).subscribe(session => {
            this.eventEntryResult.session = session;
            this.eventEntryService.findEntries(this.eventEntryResult.session.eventEdition.id).subscribe(entries => {
                this.entries = entries.json();
                this.positions = Array.from(Array(this.entries.length),(x,i)=>i+1)
            });
        });
        this.isSaving = false;
        this.authorities = ['ROLE_EDITOR', 'ROLE_ADMIN'];
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        this.eventEntryResult.bestLapTime = this.rawLapTime;
        this.eventEntryResult.totalTime = this.rawTotalTime;
        if (this.eventEntryResult.differenceType == 1) {
            this.eventEntryResult.difference = this.rawDifference;
        }
        if (this.eventEntryResult.id !== undefined) {
            this.eventEntryResultService.update(this.eventEntryResult)
                .subscribe((res: EventEntryResult) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.eventEntryResultService.create(this.eventEntryResult)
                .subscribe((res: EventEntryResult) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }
    
    trackEntryById(index: number, item: EventEntry) {
        return item.id;
    }
    
    updateUI() {
        this.eventEntryResult.retired = this.eventEntryResult.finalPosition >= 900;
    }

    private onSaveSuccess (result: EventEntryResult) {
        this.eventManager.broadcast({ name: 'eventEntryResultListModification', content: 'OK'});
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
    selector: 'jhi-event-entry-result-popup',
    template: ''
})
export class EventEntryResultPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private eventEntryResultPopupService: EventEntryResultPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            let idSession = params['idSession'];
            if ( params['id'] ) {
                this.modalRef = this.eventEntryResultPopupService
                    .open(EventEntryResultDialogComponent, idSession, params['id']);
            } else {
                this.modalRef = this.eventEntryResultPopupService
                    .open(EventEntryResultDialogComponent, idSession);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
