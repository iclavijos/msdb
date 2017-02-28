import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Racetrack } from './racetrack.model';
import { RacetrackService } from './racetrack.service';
@Injectable()
export class RacetrackPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private racetrackService: RacetrackService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.racetrackService.find(id).subscribe(racetrack => {
                this.racetrackModalRef(component, racetrack);
            });
        } else {
            return this.racetrackModalRef(component, new Racetrack());
        }
    }

    racetrackModalRef(component: Component, racetrack: Racetrack): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.racetrack = racetrack;
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
