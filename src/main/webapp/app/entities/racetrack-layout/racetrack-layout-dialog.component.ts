import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { RacetrackLayout } from './racetrack-layout.model';
import { RacetrackLayoutPopupService } from './racetrack-layout-popup.service';
import { RacetrackLayoutService } from './racetrack-layout.service';
import { Racetrack, RacetrackService } from '../racetrack';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-racetrack-layout-dialog',
    templateUrl: './racetrack-layout-dialog.component.html'
})
export class RacetrackLayoutDialogComponent implements OnInit {

    racetrackLayout: RacetrackLayout;
    authorities: any[];
    isSaving: boolean;
    trackId: number;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private racetrackLayoutService: RacetrackLayoutService,
        private racetrackService: RacetrackService,
        private elementRef: ElementRef,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_EDITOR', 'ROLE_ADMIN'];
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, racetrackLayout, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, (base64Data) => {
                racetrackLayout[field] = base64Data;
                racetrackLayout[`${field}ContentType`] = file.type;
            });
        }
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.racetrackLayout, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.racetrackLayout.id !== undefined) {
            this.subscribeToSaveResponse(
                this.racetrackLayoutService.update(this.racetrackLayout), false);
        } else {
            this.subscribeToSaveResponse(
                this.racetrackLayoutService.create(this.racetrackLayout), true);
        }
    }
    
    toogleActive() {
        this.racetrackLayout.active = !this.racetrackLayout.active;
    }

	private subscribeToSaveResponse(result: Observable<RacetrackLayout>, isCreated: boolean) {
        result.subscribe((res: RacetrackLayout) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }
    
    private onSaveSuccess(result: RacetrackLayout, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'motorsportsDatabaseApp.racetrackLayout.created'
            : 'motorsportsDatabaseApp.racetrackLayout.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'racetrackLayoutListModification', content: 'OK'});
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

    trackRacetrackById(index: number, item: Racetrack) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-racetrack-layout-popup',
    template: ''
})
export class RacetrackLayoutPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private racetrackLayoutPopupService: RacetrackLayoutPopupService
    ) {}

    ngOnInit() {
        let isNewLayout: boolean = false;
        this.routeSub = this.route.params.subscribe(params => {
            this.route.url.subscribe(url => {
                if (url.length == 3) {
                    isNewLayout = url[2].path.endsWith("-new");
                }
            });
            if ( params['id'] && !isNewLayout) {
                this.modalRef = this.racetrackLayoutPopupService
                    .open(RacetrackLayoutDialogComponent, params['id']);
            } else {
                this.modalRef = this.racetrackLayoutPopupService
                    .open(RacetrackLayoutDialogComponent, params['id'], true);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
