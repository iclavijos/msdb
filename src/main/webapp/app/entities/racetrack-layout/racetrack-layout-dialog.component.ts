import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
        private jhiAlertService: JhiAlertService,
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

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
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
                this.racetrackLayoutService.update(this.racetrackLayout));
        } else {
            this.subscribeToSaveResponse(
                this.racetrackLayoutService.create(this.racetrackLayout));
        }
    }
    
    toogleActive() {
        this.racetrackLayout.active = !this.racetrackLayout.active;
    }

    private subscribeToSaveResponse(result: Observable<RacetrackLayout>) {
        result.subscribe((res: RacetrackLayout) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }
    
    private onSaveSuccess(result: RacetrackLayout) {
        this.eventManager.broadcast({ name: 'racetrackLayoutListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
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
                this.racetrackLayoutPopupService
                    .open(RacetrackLayoutDialogComponent as Component, params['id']);
            } else {
                this.racetrackLayoutPopupService
                    .open(RacetrackLayoutDialogComponent as Component, params['id'], true);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
