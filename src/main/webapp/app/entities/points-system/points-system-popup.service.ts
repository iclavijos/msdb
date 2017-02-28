import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PointsSystem } from './points-system.model';
import { PointsSystemService } from './points-system.service';
@Injectable()
export class PointsSystemPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private pointsSystemService: PointsSystemService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.pointsSystemService.find(id).subscribe(pointsSystem => {
                this.pointsSystemModalRef(component, pointsSystem);
            });
        } else {
            return this.pointsSystemModalRef(component, new PointsSystem());
        }
    }

    pointsSystemModalRef(component: Component, pointsSystem: PointsSystem): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.pointsSystem = pointsSystem;
        modalRef.result.then(result => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
