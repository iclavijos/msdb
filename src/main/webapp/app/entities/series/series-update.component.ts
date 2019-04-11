import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiDataUtils } from 'ng-jhipster';
import { ISeries } from 'app/shared/model/series.model';
import { SeriesService } from './series.service';

@Component({
    selector: 'jhi-series-update',
    templateUrl: './series-update.component.html'
})
export class SeriesUpdateComponent implements OnInit {
    series: ISeries;
    isSaving: boolean;

    constructor(
        protected dataUtils: JhiDataUtils,
        protected seriesService: SeriesService,
        protected elementRef: ElementRef,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ series }) => {
            this.series = series;
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
        this.dataUtils.clearInputImage(this.series, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.series.id !== undefined) {
            this.subscribeToSaveResponse(this.seriesService.update(this.series));
        } else {
            this.subscribeToSaveResponse(this.seriesService.create(this.series));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ISeries>>) {
        result.subscribe((res: HttpResponse<ISeries>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
