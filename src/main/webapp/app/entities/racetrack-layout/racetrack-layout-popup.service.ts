import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Response } from '@angular/http';

import { Racetrack } from '../racetrack/racetrack.model';
import { RacetrackService } from '../racetrack/racetrack.service';
import { RacetrackLayout } from './racetrack-layout.model';
import { RacetrackLayoutService } from './racetrack-layout.service';
@Injectable()
export class RacetrackLayoutPopupService {
    private isOpen = false;
    private racetrack: Racetrack;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private racetrackService: RacetrackService,
        private racetrackLayoutService: RacetrackLayoutService

    ) {}

    open (component: Component, id?: number | any, isNewLayout: boolean = false): NgbModalRef {    
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id && !isNewLayout) {
            this.racetrackLayoutService.find(id).subscribe(racetrackLayout => {
                this.racetrackLayoutModalRef(component, racetrackLayout);
            });
        } else {
            this.racetrackService.find(id)
                .subscribe((res: Racetrack) => this.racetrack = res, (res: Response) => console.log(res.json()));
            return this.racetrackLayoutModalRef(component, new RacetrackLayout(), this.racetrack);
        }
    }

    racetrackLayoutModalRef(component: Component, racetrackLayout: RacetrackLayout, racetrack?: Racetrack): NgbModalRef {
        if (racetrack != null) {
            racetrackLayout.racetrack = racetrack;
        }
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.racetrackLayout = racetrackLayout;
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
