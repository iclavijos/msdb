import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService, DataUtils } from 'ng-jhipster';

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
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private alertService: AlertService,
        private tyreProviderService: TyreProviderService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['tyreProvider']);
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

    setFileData($event, tyreProvider, field, isImage) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];
            if (isImage && !/^image\//.test($file.type)) {
                return;
            }
            this.dataUtils.toBase64($file, (base64Data) => {
                tyreProvider[field] = base64Data;
                tyreProvider[`${field}ContentType`] = $file.type;
            });
        }
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.tyreProvider.id !== undefined) {
            this.tyreProviderService.update(this.tyreProvider)
                .subscribe((res: TyreProvider) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.tyreProviderService.create(this.tyreProvider)
                .subscribe((res: TyreProvider) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: TyreProvider) {
        this.eventManager.broadcast({ name: 'tyreProviderListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
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

    constructor (
        private route: ActivatedRoute,
        private tyreProviderPopupService: TyreProviderPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
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
