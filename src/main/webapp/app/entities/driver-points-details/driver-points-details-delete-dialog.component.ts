import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { DriverPointsDetails } from './driver-points-details.model';
import { DriverPointsDetailsPopupService } from './driver-points-details-popup.service';
import { DriverPointsDetailsService } from './driver-points-details.service';

@Component({
    selector: 'jhi-driver-points-details-delete-dialog',
    templateUrl: './driver-points-details-delete-dialog.component.html'
})
export class DriverPointsDetailsDeleteDialogComponent {

    driverPointsDetails: DriverPointsDetails;

    constructor(
        private driverPointsDetailsService: DriverPointsDetailsService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.driverPointsDetailsService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'driverPointsDetailsListModification',
                content: 'Deleted an driverPointsDetails'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-driver-points-details-delete-popup',
    template: ''
})
export class DriverPointsDetailsDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private driverPointsDetailsPopupService: DriverPointsDetailsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.driverPointsDetailsPopupService
                .open(DriverPointsDetailsDeleteDialogComponent as Component, null, null, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
