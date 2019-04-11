import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IEventEntryResult } from 'app/shared/model/event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';

@Component({
    selector: 'jhi-event-entry-result-update',
    templateUrl: './event-entry-result-update.component.html'
})
export class EventEntryResultUpdateComponent implements OnInit {
    eventEntryResult: IEventEntryResult;
    isSaving: boolean;

    constructor(protected eventEntryResultService: EventEntryResultService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ eventEntryResult }) => {
            this.eventEntryResult = eventEntryResult;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.eventEntryResult.id !== undefined) {
            this.subscribeToSaveResponse(this.eventEntryResultService.update(this.eventEntryResult));
        } else {
            this.subscribeToSaveResponse(this.eventEntryResultService.create(this.eventEntryResult));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventEntryResult>>) {
        result.subscribe((res: HttpResponse<IEventEntryResult>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
