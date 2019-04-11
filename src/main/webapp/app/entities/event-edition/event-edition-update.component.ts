import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IEventEdition } from 'app/shared/model/event-edition.model';
import { EventEditionService } from './event-edition.service';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category';
import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackLayoutService } from 'app/entities/racetrack-layout';
import { IEvent } from 'app/shared/model/event.model';
import { EventService } from 'app/entities/event';

@Component({
    selector: 'jhi-event-edition-update',
    templateUrl: './event-edition-update.component.html'
})
export class EventEditionUpdateComponent implements OnInit {
    eventEdition: IEventEdition;
    isSaving: boolean;

    categories: ICategory[];

    racetracklayouts: IRacetrackLayout[];

    events: IEvent[];
    eventDateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected eventEditionService: EventEditionService,
        protected categoryService: CategoryService,
        protected racetrackLayoutService: RacetrackLayoutService,
        protected eventService: EventService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ eventEdition }) => {
            this.eventEdition = eventEdition;
        });
        this.categoryService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICategory[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICategory[]>) => response.body)
            )
            .subscribe((res: ICategory[]) => (this.categories = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.racetrackLayoutService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IRacetrackLayout[]>) => mayBeOk.ok),
                map((response: HttpResponse<IRacetrackLayout[]>) => response.body)
            )
            .subscribe((res: IRacetrackLayout[]) => (this.racetracklayouts = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.eventService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IEvent[]>) => mayBeOk.ok),
                map((response: HttpResponse<IEvent[]>) => response.body)
            )
            .subscribe((res: IEvent[]) => (this.events = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.eventEdition.id !== undefined) {
            this.subscribeToSaveResponse(this.eventEditionService.update(this.eventEdition));
        } else {
            this.subscribeToSaveResponse(this.eventEditionService.create(this.eventEdition));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventEdition>>) {
        result.subscribe((res: HttpResponse<IEventEdition>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackCategoryById(index: number, item: ICategory) {
        return item.id;
    }

    trackRacetrackLayoutById(index: number, item: IRacetrackLayout) {
        return item.id;
    }

    trackEventById(index: number, item: IEvent) {
        return item.id;
    }
}
