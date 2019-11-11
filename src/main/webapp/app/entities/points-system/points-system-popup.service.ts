import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PointsSystem } from './points-system.model';
import { PointsSystemService } from './points-system.service';

@Injectable()
export class PointsSystemPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private pointsSystemService: PointsSystemService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.pointsSystemService.find(id).subscribe((pointsSystem) => {
                    this.ngbModalRef = this.pointsSystemModalRef(component, pointsSystem);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.pointsSystemModalRef(component, new PointsSystem());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    pointsSystemModalRef(component: Component, pointsSystem: PointsSystem): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.pointsSystem = pointsSystem;
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
