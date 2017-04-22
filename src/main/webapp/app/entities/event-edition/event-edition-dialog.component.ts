import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { EventEdition } from './event-edition.model';
import { EventEditionPopupService } from './event-edition-popup.service';
import { EventEditionService } from './event-edition.service';
import { Category, CategoryService } from '../category';
import { RacetrackLayout, RacetrackLayoutService } from '../racetrack-layout';
import { Event, EventService } from '../event';

import { MIN_DATE, CURRENT_DATE, MAX_DATE } from '../../shared';

import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

@Component({
    selector: 'jhi-event-edition-dialog',
    templateUrl: './event-edition-dialog.component.html',
    styleUrls: ['event-edition.css']
})
export class EventEditionDialogComponent implements OnInit {

    eventEdition: EventEdition;
    authorities: any[];
    isSaving: boolean;
    protected dataServiceLayout: CompleterData;
    protected dataServiceEvent: CompleterData;
    eventSelectorDisabled = false;
    private trackLayoutSearch: string;
    private eventSearch: string;
    
    minDate = MIN_DATE;
    maxDate = MAX_DATE;

    categories: Category[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private eventEditionService: EventEditionService,
        private categoryService: CategoryService,
        private racetrackLayoutService: RacetrackLayoutService,
        private eventService: EventService,
        private eventManager: EventManager,
        private completerService: CompleterService
    ) {
        this.dataServiceLayout = completerService.remote('api/_typeahead/layouts?query=', null, 'fullName').imageField("layoutImg");
        this.dataServiceEvent = completerService.remote('api/_search/events?query=', null, 'name');
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_EDITOR', 'ROLE_ADMIN'];
        this.categoryService.query().subscribe(
            (res: Response) => { this.categories = res.json(); }, (res: Response) => this.onError(res.json()));

        if (this.eventEdition.trackLayout) {
            this.trackLayoutSearch = this.eventEdition.trackLayout.racetrack.name + '-' + this.eventEdition.trackLayout.name;
        }
        if (this.eventEdition.event) {
            this.eventSearch = this.eventEdition.event.name;
        }
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.eventEdition.id !== undefined) {
            this.eventEditionService.update(this.eventEdition)
                .subscribe((res: EventEdition) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.eventEditionService.create(this.eventEdition)
                .subscribe((res: EventEdition) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: EventEdition) {
        this.eventManager.broadcast({ name: 'eventEditionListModification', content: 'OK'});
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

    trackCategoryById(index: number, item: Category) {
        return item.id;
    }

    trackRacetrackLayoutById(index: number, item: RacetrackLayout) {
        return item.id;
    }

    trackEventById(index: number, item: Event) {
        return item.id;
    }
    
    public onTrackLayoutSelected(selected: CompleterItem) {
        if (!selected.originalObject) return;
        let tracklayout = selected.originalObject.racetrackLayout;
        if (selected) {
            this.eventEdition.trackLayout = tracklayout;
            this.trackLayoutSearch = tracklayout.racetrack.name + '-' + tracklayout.name;
        } else {
            this.eventEdition.trackLayout = null;
            this.trackLayoutSearch = null;
        }
    }
    
    public onEventSelected(selected: CompleterItem) {
        if (selected) {
            this.eventEdition.event = selected.originalObject;
            this.eventSearch = selected.originalObject.name;
        } else {
            this.eventEdition.event = null;
            this.eventSearch = null;
        }
    }
    
    public addCategories() {
        if (!this.eventEdition.allowedCategories) {
            this.eventEdition.allowedCategories = [];
        }
        let availableCategories = document.getElementById('field_availableCategories') as HTMLSelectElement;
        let i: number;
        let options = availableCategories.options;
        for(i = 0; i < options.length; i++) {
            if (options[i].selected) {
                let index = this.findIndexOfAllowedCategory(+options[i].value);
                if (index === -1) {
                    this.categoryService.find(+options[i].value).subscribe(
                        (res) => { this.eventEdition.allowedCategories.push(res); }, (res: Response) => this.onError(res.json()));
                }
            }
        }
    }
    
    public removeCategories() {
        let allowedCategories = document.getElementById('field_allowedCategories') as HTMLSelectElement;
        let i: number;
        for(i = allowedCategories.options.length - 1; i >= 0; i--) {
            if (allowedCategories.options[i].selected) {
                let index = this.eventEdition.allowedCategories.indexOf(allowedCategories.options[i].value);
                this.eventEdition.allowedCategories.splice(index, 1);
            }
        }
    }
    
    private findIndexOfAllowedCategory(value: number) {
        let i = 0;
        for (let category of this.eventEdition.allowedCategories) {
            if (category.id === value) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

@Component({
    selector: 'jhi-event-edition-popup',
    template: ''
})
export class EventEditionPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private eventEditionPopupService: EventEditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.eventEditionPopupService
                    .open(EventEditionDialogComponent, params['id']);
            } else {
                this.modalRef = this.eventEditionPopupService
                    .open(EventEditionDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
