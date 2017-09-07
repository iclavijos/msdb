import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DriverPointsDetails } from './driver-points-details.model';
import { DriverPointsDetailsService } from './driver-points-details.service';

import { DriverService } from '../driver/';

@Injectable()
export class DriverPointsDetailsPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private driverPointsDetailsService: DriverPointsDetailsService,
        private driverService: DriverService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, eventEditionId: number, driverId: number, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.driverPointsDetailsService.find(id).subscribe((driverPointsDetails) => {
                    this.ngbModalRef = this.driverPointsDetailsModalRef(component, driverPointsDetails);
                    resolve(this.ngbModalRef);
                });
            } else if (eventEditionId && driverId) {
                let dpd = new DriverPointsDetails();
                dpd.eventEditionId = eventEditionId;
                this.driverService.find(driverId).subscribe((driver) => {
                    dpd.driver = driver;
                    this.ngbModalRef = this.driverPointsDetailsModalRef(component, dpd);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.driverPointsDetailsModalRef(component, new DriverPointsDetails());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    driverPointsDetailsModalRef(component: Component, driverPointsDetails: DriverPointsDetails): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.driverPointsDetails = driverPointsDetails;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
