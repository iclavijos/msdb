import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { FuelProvider } from './fuel-provider.model';
import { FuelProviderPopupService } from './fuel-provider-popup.service';
import { FuelProviderService } from './fuel-provider.service';

@Component({
    selector: 'jhi-fuel-provider-dialog',
    templateUrl: './fuel-provider-dialog.component.html'
})
export class FuelProviderDialogComponent implements OnInit {

    fuelProvider: FuelProvider;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private fuelProviderService: FuelProviderService,
        private elementRef: ElementRef,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
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

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.fuelProvider.id !== undefined) {
            this.subscribeToSaveResponse(
                this.fuelProviderService.update(this.fuelProvider));
        } else {
            this.subscribeToSaveResponse(
                this.fuelProviderService.create(this.fuelProvider));
        }
    }

    private subscribeToSaveResponse(result: Observable<FuelProvider>) {
        result.subscribe((res: FuelProvider) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: FuelProvider) {
        this.eventManager.broadcast({ name: 'fuelProviderListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-fuel-provider-popup',
    template: ''
})
export class FuelProviderPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private fuelProviderPopupService: FuelProviderPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.fuelProviderPopupService
                    .open(FuelProviderDialogComponent as Component, params['id']);
            } else {
                this.fuelProviderPopupService
                    .open(FuelProviderDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
