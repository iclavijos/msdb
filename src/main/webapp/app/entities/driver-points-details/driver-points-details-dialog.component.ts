import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DriverPointsDetails } from './driver-points-details.model';
import { DriverPointsDetailsPopupService } from './driver-points-details-popup.service';
import { DriverPointsDetailsService } from './driver-points-details.service';

@Component({
    selector: 'jhi-driver-points-details-dialog',
    templateUrl: './driver-points-details-dialog.component.html'
})
export class DriverPointsDetailsDialogComponent implements OnInit {

    driverPointsDetails: DriverPointsDetails;
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private driverPointsDetailsService: DriverPointsDetailsService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.driverPointsDetails.id !== undefined) {
            this.subscribeToSaveResponse(
                this.driverPointsDetailsService.update(this.driverPointsDetails), false);
        } else {
            this.subscribeToSaveResponse(
                this.driverPointsDetailsService.create(this.driverPointsDetails), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<DriverPointsDetails>, isCreated: boolean) {
        result.subscribe((res: DriverPointsDetails) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: DriverPointsDetails, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'motorsportsDatabaseApp.driverPointsDetails.created'
            : 'motorsportsDatabaseApp.driverPointsDetails.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'driverPointsDetailsListModification', content: 'OK'});
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
}

@Component({
    selector: 'jhi-driver-points-details-popup',
    template: ''
})
export class DriverPointsDetailsPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private driverPointsDetailsPopupService: DriverPointsDetailsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.driverPointsDetailsPopupService
                    .open(DriverPointsDetailsDialogComponent, params['id']);
            } else {
                this.modalRef = this.driverPointsDetailsPopupService
                    .open(DriverPointsDetailsDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
