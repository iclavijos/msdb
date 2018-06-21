import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private tyreProviderService: TyreProviderService,
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
        this.dataUtils.clearInputImage(this.tyreProvider, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.tyreProvider.id !== undefined) {
            this.subscribeToSaveResponse(
                this.tyreProviderService.update(this.tyreProvider));
        } else {
            this.subscribeToSaveResponse(
                this.tyreProviderService.create(this.tyreProvider));
        }
    }

    private subscribeToSaveResponse(result: Observable<TyreProvider>) {
        result.subscribe((res: TyreProvider) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: TyreProvider) {
        this.eventManager.broadcast({ name: 'tyreProviderListModification', content: 'OK'});
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
    selector: 'jhi-tyre-provider-popup',
    template: ''
})
export class TyreProviderPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private tyreProviderPopupService: TyreProviderPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.tyreProviderPopupService
                    .open(TyreProviderDialogComponent as Component, params['id']);
            } else {
                this.tyreProviderPopupService
                    .open(TyreProviderDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
