import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { EventEdition } from './event-edition.model';
import { EventEditionPopupService } from './event-edition-popup.service';
import { EventEditionService } from './event-edition.service';
import { Category, CategoryService } from '../category';
import { RacetrackLayout, RacetrackLayoutService } from '../racetrack-layout';
import { Event, EventService } from '../event';
import { ResponseWrapper } from '../../shared';

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
    eventDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventEditionService: EventEditionService,
        private categoryService: CategoryService,
        private racetrackLayoutService: RacetrackLayoutService,
        private eventService: EventService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.categoryService.query()
            .subscribe((res: ResponseWrapper) => { this.categories = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.racetrackLayoutService.query()
            .subscribe((res: ResponseWrapper) => { this.racetracklayouts = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.eventService.query()
            .subscribe((res: ResponseWrapper) => { this.events = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.eventEdition.id !== undefined) {
            this.subscribeToSaveResponse(
                this.eventEditionService.update(this.eventEdition), false);
        } else {
            this.subscribeToSaveResponse(
                this.eventEditionService.create(this.eventEdition), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<EventEdition>, isCreated: boolean) {
        result.subscribe((res: EventEdition) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: EventEdition, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'motorsportsDatabaseApp.eventEdition.created'
            : 'motorsportsDatabaseApp.eventEdition.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'eventEditionListModification', content: 'OK'});
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

    constructor(
        private route: ActivatedRoute,
        private eventEditionPopupService: EventEditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
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
