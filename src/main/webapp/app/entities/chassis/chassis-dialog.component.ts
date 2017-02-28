import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Chassis } from './chassis.model';
import { ChassisPopupService } from './chassis-popup.service';
import { ChassisService } from './chassis.service';
@Component({
    selector: 'jhi-chassis-dialog',
    templateUrl: './chassis-dialog.component.html'
})
export class ChassisDialogComponent implements OnInit {

    chassis: Chassis;
    authorities: any[];
    isSaving: boolean;

    chassisCollection: Chassis[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private chassisService: ChassisService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['chassis']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.chassisService.query().subscribe(
            (res: Response) => { this.chassisCollection = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.chassis.id !== undefined) {
            this.chassisService.update(this.chassis)
                .subscribe((res: Chassis) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.chassisService.create(this.chassis)
                .subscribe((res: Chassis) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Chassis) {
        this.eventManager.broadcast({ name: 'chassisListModification', content: 'OK'});
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

    trackChassisById(index: number, item: Chassis) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-chassis-popup',
    template: ''
})
export class ChassisPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private chassisPopupService: ChassisPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.chassisPopupService
                    .open(ChassisDialogComponent, params['id']);
            } else {
                this.modalRef = this.chassisPopupService
                    .open(ChassisDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
