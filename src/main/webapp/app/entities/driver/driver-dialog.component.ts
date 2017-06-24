import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

import { EventManager, AlertService, JhiLanguageService, DataUtils } from 'ng-jhipster';

import { MIN_DATE, CURRENT_DATE, MAX_DATE } from '../../shared';

import { Driver } from './driver.model';
import { DriverPopupService } from './driver-popup.service';
import { DriverService } from './driver.service';

@Component({
    selector: 'jhi-driver-dialog',
    templateUrl: './driver-dialog.component.html'
})
export class DriverDialogComponent implements OnInit {

    driver: Driver;
    authorities: any[];
    isSaving: boolean;
    minDate = MIN_DATE;
    startDate = CURRENT_DATE;
    protected dataServiceNationality: CompleterData;
    nationalitySearch: string;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private alertService: AlertService,
        private driverService: DriverService,
        private eventManager: EventManager,
        private completerService: CompleterService
    ) {
        this.jhiLanguageService.setLocations(['driver']);
        this.dataServiceNationality = completerService.remote('api/_typeahead/countries?query=', null, 'countryName').imageField("flagImg");
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

    setFileData($event, driver, field, isImage) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];
            if (isImage && !/^image\//.test($file.type)) {
                return;
            }
            this.dataUtils.toBase64($file, (base64Data) => {
                driver[field] = base64Data;
                driver[`${field}ContentType`] = $file.type;
            });
        }
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.driver.id !== undefined) {
            this.driverService.update(this.driver)
                .subscribe((res: Driver) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.driverService.create(this.driver)
                .subscribe((res: Driver) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Driver) {
        this.eventManager.broadcast({ name: 'driverListModification', content: 'OK'});
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
    
    public onCountrySelected(selected: CompleterItem) {
        if (!selected || !selected.originalObject) return;
        let country = selected.originalObject;
        if (selected) {
            this.driver.nationality = country.countryCode;
            this.nationalitySearch = country.countryName;
        } else {
            this.driver.nationality = null;
            this.nationalitySearch = null;
        }
    }
}

@Component({
    selector: 'jhi-driver-popup',
    template: ''
})
export class DriverPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private driverPopupService: DriverPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.driverPopupService
                    .open(DriverDialogComponent, params['id']);
            } else {
                this.modalRef = this.driverPopupService
                    .open(DriverDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
