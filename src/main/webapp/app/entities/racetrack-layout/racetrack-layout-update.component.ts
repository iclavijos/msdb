import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackLayoutService } from './racetrack-layout.service';
import { IRacetrack } from 'app/shared/model/racetrack.model';
import { RacetrackService } from 'app/entities/racetrack';

@Component({
    selector: 'jhi-racetrack-layout-update',
    templateUrl: './racetrack-layout-update.component.html'
})
export class RacetrackLayoutUpdateComponent implements OnInit {
    racetrackLayout: IRacetrackLayout;
    isSaving: boolean;

    racetracks: IRacetrack[];

    constructor(
        protected dataUtils: JhiDataUtils,
        protected jhiAlertService: JhiAlertService,
        protected racetrackLayoutService: RacetrackLayoutService,
        protected racetrackService: RacetrackService,
        protected elementRef: ElementRef,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ racetrackLayout }) => {
            this.racetrackLayout = racetrackLayout;
        });
        this.racetrackService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IRacetrack[]>) => mayBeOk.ok),
                map((response: HttpResponse<IRacetrack[]>) => response.body)
            )
            .subscribe((res: IRacetrack[]) => (this.racetracks = res), (res: HttpErrorResponse) => this.onError(res.message));
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
        this.dataUtils.clearInputImage(this.racetrackLayout, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.racetrackLayout.id !== undefined) {
            this.subscribeToSaveResponse(this.racetrackLayoutService.update(this.racetrackLayout));
        } else {
            this.subscribeToSaveResponse(this.racetrackLayoutService.create(this.racetrackLayout));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IRacetrackLayout>>) {
        result.subscribe((res: HttpResponse<IRacetrackLayout>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackRacetrackById(index: number, item: IRacetrack) {
        return item.id;
    }
}
