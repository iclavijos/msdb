import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService, DataUtils } from 'ng-jhipster';

import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

import { Racetrack } from './racetrack.model';
import { RacetrackPopupService } from './racetrack-popup.service';
import { RacetrackService } from './racetrack.service';
import { RacetrackLayout, RacetrackLayoutService } from '../racetrack-layout';

@Component({
    selector: 'jhi-racetrack-dialog',
    templateUrl: './racetrack-dialog.component.html'
})
export class RacetrackDialogComponent implements OnInit {

    racetrack: Racetrack;
    authorities: any[];
    isSaving: boolean;
    protected dataServiceCountry: CompleterData;
    countrySearch: string;

    racetracklayouts: RacetrackLayout[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private alertService: AlertService,
        private racetrackService: RacetrackService,
        private racetrackLayoutService: RacetrackLayoutService,
        private eventManager: EventManager,
        private completerService: CompleterService
    ) {
        this.jhiLanguageService.setLocations(['racetrack']);
        this.dataServiceCountry = completerService.remote('api/_typeahead/countries?query=', null, 'countryName').imageField("flagImg");
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

    setFileData($event, racetrack, field, isImage) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];
            if (isImage && !/^image\//.test($file.type)) {
                return;
            }
            this.dataUtils.toBase64($file, (base64Data) => {
                racetrack[field] = base64Data;
                racetrack[`${field}ContentType`] = $file.type;
            });
        }
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.racetrack.id !== undefined) {
            this.racetrackService.update(this.racetrack)
                .subscribe((res: Racetrack) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.racetrackService.create(this.racetrack)
                .subscribe((res: Racetrack) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Racetrack) {
        this.eventManager.broadcast({ name: 'racetrackModification', content: result});
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

    trackRacetrackLayoutById(index: number, item: RacetrackLayout) {
        return item.id;
    }
    
    public onCountrySelected(selected: CompleterItem) {
        if (!selected || !selected.originalObject) return;
        let country = selected.originalObject;
        if (selected) {
            this.racetrack.countryCode = country.countryCode;
            this.countrySearch = country.countryName;
        } else {
            this.racetrack.countryCode = null;
            this.countrySearch = null;
        }
    }
}

@Component({
    selector: 'jhi-racetrack-popup',
    template: ''
})
export class RacetrackPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private racetrackPopupService: RacetrackPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
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
