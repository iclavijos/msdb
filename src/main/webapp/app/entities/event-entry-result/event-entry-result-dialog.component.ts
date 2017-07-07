import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiLanguageService } from 'ng-jhipster';

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
    bestLapTime: string;
    totalTime: string;
    timeDifference: string;
    sessionType = SessionType;
    private eventEditionId;
    private positions: number[];
    private multidriver: boolean = false;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: JhiAlertService,
        private eventEntryService: EventEntryService,
        private eventEntryResultService: EventEntryResultService,
        private eventSessionService: EventSessionService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
        private router: Router
    ) {
        //this.jhiLanguageService.setLocations(['eventEntryResult']);
    }

    ngOnInit() {
        this.eventSessionService.find(this.eventEntryResult.session.id).subscribe(session => {
            this.eventEntryResult.session = session;
            this.multidriver = session.eventEdition.multidriver;
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
        if (this.bestLapTime) {
            this.eventEntryResult.bestLapTime = this.toMillis(this.bestLapTime);
        }
        if (this.totalTime) {
            this.eventEntryResult.totalTime = this.toMillis(this.totalTime);
        }
        if (this.eventEntryResult.differenceType == 1) {
            if (this.timeDifference != undefined) {
                this.eventEntryResult.difference = this.toMillis(this.timeDifference);
            }
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
    
    private toMillis(laptime : string) {
        if (!laptime) return;
        
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let millis = 0;
        let tenthousands : string;
        let last = 0;
        
        if (laptime.indexOf('h') != -1) {
            last = laptime.indexOf('h');
            hours = parseInt(laptime.substring(0, last));
        }
        //Minutes
        if (last != 0) {
            last++;
        }
        if (laptime.indexOf('\'') != -1) {
            minutes = parseInt(laptime.substring(last, laptime.indexOf('\'')));
            last = laptime.indexOf('\'');
        }
        
        //Seconds
        if (laptime.indexOf('.') != -1) {
            if (last != 0) {
                last++;
            }
            seconds = parseInt(laptime.substring(last, laptime.indexOf('.')));
            last = laptime.indexOf('.');
            
            //millis
            tenthousands = String(laptime.substring(last + 1) + '0000').slice(0, 4);
        } else {
            seconds = parseInt(laptime.substring(last + 1));
            tenthousands = '0000';
        }
        
        return parseInt((hours * 3600 + minutes * 60 + seconds).toString() + tenthousands);
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
