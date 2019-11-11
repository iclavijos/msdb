import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Driver } from './driver.model';
import { DriverPopupService } from './driver-popup.service';
import { DriverService } from './driver.service';

@Component({
    selector: 'jhi-driver-dialog',
    templateUrl: './driver-dialog.component.html'
})
export class DriverDialogComponent implements OnInit {

    driver: Driver;
    isSaving: boolean;
    birthDateDp: any;
    deathDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private driverService: DriverService,
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
        this.dataUtils.clearInputImage(this.driver, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.driver.id !== undefined) {
            this.subscribeToSaveResponse(
                this.driverService.update(this.driver));
        } else {
            this.subscribeToSaveResponse(
                this.driverService.create(this.driver));
        }
    }

    private subscribeToSaveResponse(result: Observable<Driver>) {
        result.subscribe((res: Driver) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Driver) {
        this.eventManager.broadcast({ name: 'driverListModification', content: 'OK'});
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
    selector: 'jhi-driver-popup',
    template: ''
})
export class DriverPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private driverPopupService: DriverPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.driverPopupService
                    .open(DriverDialogComponent as Component, params['id']);
            } else {
                this.driverPopupService
                    .open(DriverDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
