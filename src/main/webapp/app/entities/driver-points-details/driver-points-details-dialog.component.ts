import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
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

    private subscribeToSaveResponse(result: Observable<DriverPointsDetails>) {
        result.subscribe((res: DriverPointsDetails) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: DriverPointsDetails) {
        this.eventManager.broadcast({ name: 'driverPointsDetailsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-driver-points-details-popup',
    template: ''
})
export class DriverPointsDetailsPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private driverPointsDetailsPopupService: DriverPointsDetailsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.driverPointsDetailsPopupService
                    .open(DriverPointsDetailsDialogComponent as Component, params['id']);
            } else {
                this.driverPointsDetailsPopupService
                    .open(DriverPointsDetailsDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
