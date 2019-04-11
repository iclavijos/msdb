import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiDataUtils } from 'ng-jhipster';
import { IRacetrack } from 'app/shared/model/racetrack.model';
import { RacetrackService } from './racetrack.service';

@Component({
    selector: 'jhi-racetrack-update',
    templateUrl: './racetrack-update.component.html'
})
export class RacetrackUpdateComponent implements OnInit {
    racetrack: IRacetrack;
    isSaving: boolean;

    constructor(
        protected dataUtils: JhiDataUtils,
        protected racetrackService: RacetrackService,
        protected elementRef: ElementRef,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ racetrack }) => {
            this.racetrack = racetrack;
        });
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.racetrack, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.racetrack.id !== undefined) {
            this.subscribeToSaveResponse(this.racetrackService.update(this.racetrack));
        } else {
            this.subscribeToSaveResponse(this.racetrackService.create(this.racetrack));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IRacetrack>>) {
        result.subscribe((res: HttpResponse<IRacetrack>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
