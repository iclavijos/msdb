import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    isSaving: boolean;

    categories: Category[];

    racetracklayouts: RacetrackLayout[];

    events: Event[];
    eventDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventEditionService: EventEditionService,
        private categoryService: CategoryService,
        private racetrackLayoutService: RacetrackLayoutService,
        private eventService: EventService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
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
                this.eventEditionService.update(this.eventEdition));
        } else {
            this.subscribeToSaveResponse(
                this.eventEditionService.create(this.eventEdition));
        }
    }

    private subscribeToSaveResponse(result: Observable<EventEdition>) {
        result.subscribe((res: EventEdition) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: EventEdition) {
        this.eventManager.broadcast({ name: 'eventEditionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private eventEditionPopupService: EventEditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.eventEditionPopupService
                    .open(EventEditionDialogComponent as Component, params['id']);
            } else {
                this.eventEditionPopupService
                    .open(EventEditionDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
