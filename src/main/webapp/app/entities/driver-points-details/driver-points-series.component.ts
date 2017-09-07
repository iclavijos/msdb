import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DriverPointsDetailsPopupService } from './driver-points-details-popup.service';
import { DriverPointsDetailsService } from './driver-points-details.service';

@Component({
    selector: 'jhi-driver-points-series',
    templateUrl: './driver-points-series.component.html'
})
export class DriverPointsSeriesDialogComponent implements OnInit {

    driverPointsDetails: any;
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
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.driverPointsDetails.id !== undefined) {
            this.subscribeToSaveResponse(
                this.driverPointsDetailsService.update(this.driverPointsDetails));
        } else {
            this.subscribeToSaveResponse(
                this.driverPointsDetailsService.create(this.driverPointsDetails));
        }
    }

    private subscribeToSaveResponse(result: Observable<any>) {
        result.subscribe((res: any) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: any) {
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
    selector: 'jhi-driver-points-series-popup',
    template: ''
})
export class DriverPointsSeriesPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private driverPointsDetailsPopupService: DriverPointsDetailsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.driverPointsDetailsPopupService
                    .open(DriverPointsSeriesDialogComponent as Component, null, null, params['id']);
            } else {
                this.driverPointsDetailsPopupService
                    .open(DriverPointsSeriesDialogComponent as Component, params['eventEditionId'], params['driverId']);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
