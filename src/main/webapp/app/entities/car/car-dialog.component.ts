import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService, DataUtils } from 'ng-jhipster';

import { Car } from './car.model';
import { CarPopupService } from './car-popup.service';
import { CarService } from './car.service';
import { Engine, EngineService } from '../engine';
import { Chassis, ChassisService } from '../chassis';
@Component({
    selector: 'jhi-car-dialog',
    templateUrl: './car-dialog.component.html'
})
export class CarDialogComponent implements OnInit {

    car: Car;
    authorities: any[];
    isSaving: boolean;

    engines: Engine[];

    chassis: Chassis[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private alertService: AlertService,
        private carService: CarService,
        private engineService: EngineService,
        private chassisService: ChassisService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['car']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.engineService.query().subscribe(
            (res: Response) => { this.engines = res.json(); }, (res: Response) => this.onError(res.json()));
        this.chassisService.query().subscribe(
            (res: Response) => { this.chassis = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData($event, car, field, isImage) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];
            if (isImage && !/^image\//.test($file.type)) {
                return;
            }
            this.dataUtils.toBase64($file, (base64Data) => {
                car[field] = base64Data;
                car[`${field}ContentType`] = $file.type;
            });
        }
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.car.id !== undefined) {
            this.carService.update(this.car)
                .subscribe((res: Car) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.carService.create(this.car)
                .subscribe((res: Car) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Car) {
        this.eventManager.broadcast({ name: 'carListModification', content: 'OK'});
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

    trackEngineById(index: number, item: Engine) {
        return item.id;
    }

    trackChassisById(index: number, item: Chassis) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-car-popup',
    template: ''
})
export class CarPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private carPopupService: CarPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.carPopupService
                    .open(CarDialogComponent, params['id']);
            } else {
                this.modalRef = this.carPopupService
                    .open(CarDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
