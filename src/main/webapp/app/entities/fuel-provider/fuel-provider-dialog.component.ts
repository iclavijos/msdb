import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private fuelProviderService: FuelProviderService,
        private elementRef: ElementRef,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, fuelProvider, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, (base64Data) => {
                fuelProvider[field] = base64Data;
                fuelProvider[`${field}ContentType`] = file.type;
            });
        }
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
                this.fuelProviderService.update(this.fuelProvider), false);
        } else {
            this.subscribeToSaveResponse(
                this.fuelProviderService.create(this.fuelProvider), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<FuelProvider>, isCreated: boolean) {
        result.subscribe((res: FuelProvider) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: FuelProvider, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'motorsportsDatabaseApp.fuelProvider.created'
            : 'motorsportsDatabaseApp.fuelProvider.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'fuelProviderListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-fuel-provider-popup',
    template: ''
})
export class FuelProviderPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private fuelProviderPopupService: FuelProviderPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.fuelProviderPopupService
                    .open(FuelProviderDialogComponent, params['id']);
            } else {
                this.modalRef = this.fuelProviderPopupService
                    .open(FuelProviderDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
