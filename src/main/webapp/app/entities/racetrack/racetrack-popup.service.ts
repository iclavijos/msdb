import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Racetrack } from './racetrack.model';
import { RacetrackService } from './racetrack.service';

@Injectable()
export class RacetrackPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private racetrackService: RacetrackService

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
                this.racetrackService.find(id).subscribe((racetrack) => {
                    this.ngbModalRef = this.racetrackModalRef(component, racetrack);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.racetrackModalRef(component, new Racetrack());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    racetrackModalRef(component: Component, racetrack: Racetrack): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.racetrack = racetrack;
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
