import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { TyreProvider } from './tyre-provider.model';
import { TyreProviderPopupService } from './tyre-provider-popup.service';
import { TyreProviderService } from './tyre-provider.service';

@Component({
    selector: 'jhi-tyre-provider-dialog',
    templateUrl: './tyre-provider-dialog.component.html'
})
export class TyreProviderDialogComponent implements OnInit {

    tyreProvider: TyreProvider;
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private tyreProviderService: TyreProviderService,
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

    setFileData(event, tyreProvider, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, (base64Data) => {
                tyreProvider[field] = base64Data;
                tyreProvider[`${field}ContentType`] = file.type;
            });
        }
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.tyreProvider, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.tyreProvider.id !== undefined) {
            this.subscribeToSaveResponse(
                this.tyreProviderService.update(this.tyreProvider), false);
        } else {
            this.subscribeToSaveResponse(
                this.tyreProviderService.create(this.tyreProvider), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<TyreProvider>, isCreated: boolean) {
        result.subscribe((res: TyreProvider) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: TyreProvider, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'motorsportsDatabaseApp.tyreProvider.created'
            : 'motorsportsDatabaseApp.tyreProvider.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'tyreProviderListModification', content: 'OK'});
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
    selector: 'jhi-tyre-provider-popup',
    template: ''
})
export class TyreProviderPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private tyreProviderPopupService: TyreProviderPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.tyreProviderPopupService
                    .open(TyreProviderDialogComponent, params['id']);
            } else {
                this.modalRef = this.tyreProviderPopupService
                    .open(TyreProviderDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
