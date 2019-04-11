import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Chassis } from './chassis.model';
import { ChassisPopupService } from './chassis-popup.service';
import { ChassisService } from './chassis.service';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-chassis-dialog',
    templateUrl: './chassis-dialog.component.html'
})
export class ChassisDialogComponent implements OnInit {

    chassis: Chassis;
    isSaving: boolean;

    chassisCollection: Chassis[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private chassisService: ChassisService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
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
                this.chassisService.update(this.chassis));
        } else {
            this.subscribeToSaveResponse(
                this.chassisService.create(this.chassis));
        }
    }

    private subscribeToSaveResponse(result: Observable<Chassis>) {
        result.subscribe((res: Chassis) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Chassis) {
        this.eventManager.broadcast({ name: 'chassisListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private chassisPopupService: ChassisPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.chassisPopupService
                    .open(ChassisDialogComponent as Component, params['id']);
            } else {
                this.chassisPopupService
                    .open(ChassisDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
