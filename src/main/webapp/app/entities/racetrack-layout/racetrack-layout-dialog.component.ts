import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService, DataUtils } from 'ng-jhipster';

import { RacetrackLayout } from './racetrack-layout.model';
import { RacetrackLayoutPopupService } from './racetrack-layout-popup.service';
import { RacetrackLayoutService } from './racetrack-layout.service';
import { Racetrack, RacetrackService } from '../racetrack';
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
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private alertService: AlertService,
        private racetrackLayoutService: RacetrackLayoutService,
        private racetrackService: RacetrackService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['racetrack']);
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

    setFileData($event, racetrackLayout, field, isImage) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];
            if (isImage && !/^image\//.test($file.type)) {
                return;
            }
            this.dataUtils.toBase64($file, (base64Data) => {
                racetrackLayout[field] = base64Data;
                racetrackLayout[`${field}ContentType`] = $file.type;
            });
        }
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.racetrackLayout.id !== undefined) {
            this.racetrackLayoutService.update(this.racetrackLayout)
                .subscribe((res: RacetrackLayout) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.racetrackLayoutService.create(this.racetrackLayout)
                .subscribe((res: RacetrackLayout) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: RacetrackLayout) {
        this.eventManager.broadcast({ name: 'racetrackLayoutsModification', content: 'OK'});
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

    constructor (
        private route: ActivatedRoute,
        private racetrackLayoutPopupService: RacetrackLayoutPopupService
    ) {}

    ngOnInit() {
        let isNewLayout: boolean = false;
        this.routeSub = this.route.params.subscribe(params => {
            this.route.url.subscribe(url => {
                isNewLayout = url[0].path.endsWith("-new");
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
