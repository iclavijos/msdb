import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiDataUtils } from 'ng-jhipster';
import { IFuelProvider } from 'app/shared/model/fuel-provider.model';
import { FuelProviderService } from './fuel-provider.service';

@Component({
    selector: 'jhi-fuel-provider-update',
    templateUrl: './fuel-provider-update.component.html'
})
export class FuelProviderUpdateComponent implements OnInit {
    fuelProvider: IFuelProvider;
    isSaving: boolean;

    constructor(
        protected dataUtils: JhiDataUtils,
        protected fuelProviderService: FuelProviderService,
        protected elementRef: ElementRef,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ fuelProvider }) => {
            this.fuelProvider = fuelProvider;
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
        this.dataUtils.clearInputImage(this.fuelProvider, this.elementRef, field, fieldContentType, idInput);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.fuelProvider.id !== undefined) {
            this.subscribeToSaveResponse(this.fuelProviderService.update(this.fuelProvider));
        } else {
            this.subscribeToSaveResponse(this.fuelProviderService.create(this.fuelProvider));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IFuelProvider>>) {
        result.subscribe((res: HttpResponse<IFuelProvider>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
