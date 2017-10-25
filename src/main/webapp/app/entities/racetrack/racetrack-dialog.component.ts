import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Racetrack } from './racetrack.model';
import { RacetrackPopupService } from './racetrack-popup.service';
import { RacetrackService } from './racetrack.service';

@Component({
    selector: 'jhi-racetrack-dialog',
    templateUrl: './racetrack-dialog.component.html'
})
export class RacetrackDialogComponent implements OnInit {

    racetrack: Racetrack;
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private racetrackService: RacetrackService,
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

    setFileData(event, racetrack, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, (base64Data) => {
                racetrack[field] = base64Data;
                racetrack[`${field}ContentType`] = file.type;
            });
        }
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.racetrack, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.racetrack.id !== undefined) {
            this.subscribeToSaveResponse(
                this.racetrackService.update(this.racetrack), false);
        } else {
            this.subscribeToSaveResponse(
                this.racetrackService.create(this.racetrack), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Racetrack>, isCreated: boolean) {
        result.subscribe((res: Racetrack) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Racetrack, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'motorsportsDatabaseApp.racetrack.created'
            : 'motorsportsDatabaseApp.racetrack.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'racetrackListModification', content: 'OK'});
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
    selector: 'jhi-racetrack-popup',
    template: ''
})
export class RacetrackPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private racetrackPopupService: RacetrackPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.racetrackPopupService
                    .open(RacetrackDialogComponent, params['id']);
            } else {
                this.modalRef = this.racetrackPopupService
                    .open(RacetrackDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
