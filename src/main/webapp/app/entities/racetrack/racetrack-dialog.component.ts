import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private racetrackService: RacetrackService,
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
        this.dataUtils.clearInputImage(this.racetrack, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.racetrack.id !== undefined) {
            this.subscribeToSaveResponse(
                this.racetrackService.update(this.racetrack));
        } else {
            this.subscribeToSaveResponse(
                this.racetrackService.create(this.racetrack));
        }
    }

    private subscribeToSaveResponse(result: Observable<Racetrack>) {
        result.subscribe((res: Racetrack) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Racetrack) {
        this.eventManager.broadcast({ name: 'racetrackListModification', content: 'OK'});
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
    selector: 'jhi-racetrack-popup',
    template: ''
})
export class RacetrackPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private racetrackPopupService: RacetrackPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.racetrackPopupService
                    .open(RacetrackDialogComponent as Component, params['id']);
            } else {
                this.racetrackPopupService
                    .open(RacetrackDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
