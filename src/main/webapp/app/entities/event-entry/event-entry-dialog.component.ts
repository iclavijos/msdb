import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { EventEntry } from './event-entry.model';
import { EventEntryPopupService } from './event-entry-popup.service';
import { EventEntryService } from './event-entry.service';
import { Car, CarService } from '../car';
import { Driver, DriverService } from '../driver';
import { Team, TeamService } from '../team';
@Component({
    selector: 'jhi-event-entry-dialog',
    templateUrl: './event-entry-dialog.component.html'
})
export class EventEntryDialogComponent implements OnInit {

    eventEntry: EventEntry;
    authorities: any[];
    isSaving: boolean;

    cars: Car[];

    drivers: Driver[];

    teams: Team[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private eventEntryService: EventEntryService,
        private carService: CarService,
        private driverService: DriverService,
        private teamService: TeamService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['eventEntry']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.carService.query().subscribe(
            (res: Response) => { this.cars = res.json(); }, (res: Response) => this.onError(res.json()));
        this.driverService.query().subscribe(
            (res: Response) => { this.drivers = res.json(); }, (res: Response) => this.onError(res.json()));
        this.teamService.query().subscribe(
            (res: Response) => { this.teams = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.eventEntry.id !== undefined) {
            this.eventEntryService.update(this.eventEntry)
                .subscribe((res: EventEntry) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.eventEntryService.create(this.eventEntry)
                .subscribe((res: EventEntry) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: EventEntry) {
        this.eventManager.broadcast({ name: 'eventEntryListModification', content: 'OK'});
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

    trackCarById(index: number, item: Car) {
        return item.id;
    }

    trackDriverById(index: number, item: Driver) {
        return item.id;
    }

    trackTeamById(index: number, item: Team) {
        return item.id;
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
    selector: 'jhi-event-entry-popup',
    template: ''
})
export class EventEntryPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private eventEntryPopupService: EventEntryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.eventEntryPopupService
                    .open(EventEntryDialogComponent, params['id']);
            } else {
                this.modalRef = this.eventEntryPopupService
                    .open(EventEntryDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
