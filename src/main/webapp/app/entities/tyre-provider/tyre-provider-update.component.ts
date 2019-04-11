import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiDataUtils } from 'ng-jhipster';
import { ITyreProvider } from 'app/shared/model/tyre-provider.model';
import { TyreProviderService } from './tyre-provider.service';

@Component({
    selector: 'jhi-tyre-provider-update',
    templateUrl: './tyre-provider-update.component.html'
})
export class TyreProviderUpdateComponent implements OnInit {
    tyreProvider: ITyreProvider;
    isSaving: boolean;

    constructor(
        protected dataUtils: JhiDataUtils,
        protected tyreProviderService: TyreProviderService,
        protected elementRef: ElementRef,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ tyreProvider }) => {
            this.tyreProvider = tyreProvider;
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
        this.dataUtils.clearInputImage(this.tyreProvider, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.tyreProvider.id !== undefined) {
            this.subscribeToSaveResponse(this.tyreProviderService.update(this.tyreProvider));
        } else {
            this.subscribeToSaveResponse(this.tyreProviderService.create(this.tyreProvider));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITyreProvider>>) {
        result.subscribe((res: HttpResponse<ITyreProvider>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
