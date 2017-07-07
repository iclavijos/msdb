import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Chassis } from './chassis.model';
import { ChassisPopupService } from './chassis-popup.service';
import { ChassisService } from './chassis.service';

import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-chassis-dialog',
    templateUrl: './chassis-dialog.component.html'
})
export class ChassisDialogComponent implements OnInit {

    chassis: Chassis;
    authorities: any[];
    isSaving: boolean;
    private derivedFromSearch: string;
    protected dataService: CompleterData;

    chassisCollection: Chassis[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private chassisService: ChassisService,
        private eventManager: JhiEventManager,
        private completerService: CompleterService
    ) {
        this.dataService = completerService.remote('api/_search/chassis?query=', null, 'name').descriptionField("manufacturer");
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_EDITOR', 'ROLE_ADMIN'];
        this.chassisService.query()
            .subscribe((res: ResponseWrapper) => { this.chassisCollection = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.chassis.id !== undefined) {
            this.subscribeToSaveResponse(
                this.chassisService.update(this.chassis), false);
        } else {
            this.subscribeToSaveResponse(
                this.chassisService.create(this.chassis), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Chassis>, isCreated: boolean) {
        result.subscribe((res: Chassis) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Chassis, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'motorsportsDatabaseApp.chassis.created'
            : 'motorsportsDatabaseApp.chassis.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'chassisListModification', content: 'OK'});
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

    trackChassisById(index: number, item: Chassis) {
        return item.id;
    }
    
    public onChassisSelected(selected: CompleterItem) {
        if (selected) {
            this.chassis.derivedFrom = selected.originalObject;
            this.derivedFromSearch = this.chassis.manufacturer + ' ' + this.chassis.name;
        } else {
            this.chassis.derivedFrom = null;
            this.derivedFromSearch = null;
        }
    }
}

@Component({
    selector: 'jhi-chassis-popup',
    template: ''
})
export class ChassisPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private chassisPopupService: ChassisPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
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
