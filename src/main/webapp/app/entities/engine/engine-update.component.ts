import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IEngine } from 'app/shared/model/engine.model';
import { EngineService } from './engine.service';

@Component({
    selector: 'jhi-engine-update',
    templateUrl: './engine-update.component.html'
})
export class EngineUpdateComponent implements OnInit {
    engine: IEngine;
    isSaving: boolean;

    engines: IEngine[];

    constructor(
        protected dataUtils: JhiDataUtils,
        protected jhiAlertService: JhiAlertService,
        protected engineService: EngineService,
        protected elementRef: ElementRef,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ engine }) => {
            this.engine = engine;
        });
        this.engineService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IEngine[]>) => mayBeOk.ok),
                map((response: HttpResponse<IEngine[]>) => response.body)
            )
            .subscribe((res: IEngine[]) => (this.engines = res), (res: HttpErrorResponse) => this.onError(res.message));
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
        this.dataUtils.clearInputImage(this.engine, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.engine.id !== undefined) {
            this.subscribeToSaveResponse(this.engineService.update(this.engine));
        } else {
            this.subscribeToSaveResponse(this.engineService.create(this.engine));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IEngine>>) {
        result.subscribe((res: HttpResponse<IEngine>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackEngineById(index: number, item: IEngine) {
        return item.id;
    }
}
