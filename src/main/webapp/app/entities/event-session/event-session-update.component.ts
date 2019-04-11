import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IEventSession } from 'app/shared/model/event-session.model';
import { EventSessionService } from './event-session.service';

@Component({
    selector: 'jhi-event-session-update',
    templateUrl: './event-session-update.component.html'
})
export class EventSessionUpdateComponent implements OnInit {
    eventSession: IEventSession;
    isSaving: boolean;
    sessionStartTime: string;

    constructor(protected eventSessionService: EventSessionService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ eventSession }) => {
            this.eventSession = eventSession;
            this.sessionStartTime =
                this.eventSession.sessionStartTime != null ? this.eventSession.sessionStartTime.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.eventSession.sessionStartTime = this.sessionStartTime != null ? moment(this.sessionStartTime, DATE_TIME_FORMAT) : null;
        if (this.eventSession.id !== undefined) {
            this.subscribeToSaveResponse(this.eventSessionService.update(this.eventSession));
        } else {
            this.subscribeToSaveResponse(this.eventSessionService.create(this.eventSession));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventSession>>) {
        result.subscribe((res: HttpResponse<IEventSession>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
