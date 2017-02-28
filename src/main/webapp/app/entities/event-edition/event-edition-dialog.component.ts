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
@Component({
    selector: 'jhi-event-edition-dialog',
    templateUrl: './event-edition-dialog.component.html'
})
export class EventEditionDialogComponent implements OnInit {

    eventEdition: EventEdition;
    authorities: any[];
    isSaving: boolean;

    categories: Category[];

    racetracklayouts: RacetrackLayout[];

    events: Event[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private eventEditionService: EventEditionService,
        private categoryService: CategoryService,
        private racetrackLayoutService: RacetrackLayoutService,
        private eventService: EventService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['eventEdition']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.categoryService.query().subscribe(
            (res: Response) => { this.categories = res.json(); }, (res: Response) => this.onError(res.json()));
        this.racetrackLayoutService.query().subscribe(
            (res: Response) => { this.racetracklayouts = res.json(); }, (res: Response) => this.onError(res.json()));
        this.eventService.query().subscribe(
            (res: Response) => { this.events = res.json(); }, (res: Response) => this.onError(res.json()));
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
