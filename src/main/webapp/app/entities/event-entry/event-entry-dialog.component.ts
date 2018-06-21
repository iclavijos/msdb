import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { EventEntry } from './event-entry.model';
import { EventEntryPopupService } from './event-entry-popup.service';
import { EventEntryService } from './event-entry.service';
import { Car, CarService } from '../car';
import { Driver, DriverService } from '../driver';
import { Team, TeamService } from '../team';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-event-entry-dialog',
    templateUrl: './event-entry-dialog.component.html'
})
export class EventEntryDialogComponent implements OnInit {

    eventEntry: EventEntry;
    isSaving: boolean;

    cars: Car[];

    drivers: Driver[];

    teams: Team[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventEntryService: EventEntryService,
        private carService: CarService,
        private driverService: DriverService,
        private teamService: TeamService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.carService.query()
            .subscribe((res: ResponseWrapper) => { this.cars = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.driverService.query()
            .subscribe((res: ResponseWrapper) => { this.drivers = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.teamService.query()
            .subscribe((res: ResponseWrapper) => { this.teams = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.eventEntry.id !== undefined) {
            this.subscribeToSaveResponse(
                this.eventEntryService.update(this.eventEntry));
        } else {
            this.subscribeToSaveResponse(
                this.eventEntryService.create(this.eventEntry));
        }
    }

    private subscribeToSaveResponse(result: Observable<EventEntry>) {
        result.subscribe((res: EventEntry) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: EventEntry) {
        this.eventManager.broadcast({ name: 'eventEntryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private eventEntryPopupService: EventEntryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.eventEntryPopupService
                    .open(EventEntryDialogComponent as Component, params['id']);
            } else {
                this.eventEntryPopupService
                    .open(EventEntryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
