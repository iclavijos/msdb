import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Racetrack } from '../racetrack/racetrack.model';
import { RacetrackService } from '../racetrack/racetrack.service';
import { RacetrackLayout } from './racetrack-layout.model';
import { RacetrackLayoutService } from './racetrack-layout.service';

@Injectable()
export class RacetrackLayoutPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private racetrackService: RacetrackService,
        private racetrackLayoutService: RacetrackLayoutService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any, isNewLayout = false): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }
            
            if (!isNewLayout) {
            	this.racetrackLayoutService.find(id).subscribe((racetrackLayout) => {
                	this.ngbModalRef = this.racetrackLayoutModalRef(component, racetrackLayout);
                    resolve(this.ngbModalRef);
	            });
    	    } else {
        	    this.racetrackService.find(id).subscribe((racetrack) => {
        	    	this.ngbModalRef = this.racetrackLayoutModalRef(component, new RacetrackLayout(), racetrack);
                    resolve(this.ngbModalRef);
            	});
        	}
        });
    }

    racetrackLayoutModalRef(component: Component, racetrackLayout: RacetrackLayout, racetrack?: Racetrack): NgbModalRef {
        if (racetrack != null) {
            racetrackLayout.racetrack = racetrack;
        }
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.racetrackLayout = racetrackLayout;
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
