import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventSession } from './event-session.model';
import { EventSessionService } from './event-session.service';

import { EventEdition } from '../event-edition/event-edition.model';
import { EventEditionService } from '../event-edition/event-edition.service';

import * as moment from 'moment-timezone';

@Injectable()
export class EventSessionPopupService {
    private ngbModalRef: NgbModalRef;

    
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private eventSessionService: EventSessionService,
        private eventEditionService: EventEditionService,
    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any, idEdition?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.eventSessionService.find(id).subscribe((eventSession) => {
                    eventSession.sessionStartTime = moment(eventSession.sessionStartTime*1000)
                        .tz(eventSession.eventEdition.trackLayout.racetrack.timeZone).format("YYYY-MM-DDTHH:mm");
                    this.eventSessionModalRef(component, eventSession);
                    resolve(this.ngbModalRef);
                });
            } else {
                this.eventEditionService.find(idEdition).subscribe((eventEdition) => {
                    let eventSess = new EventSession();
                    eventSess.eventEdition = eventEdition;
                    this.eventSessionModalRef(component, eventSess);
                    resolve(this.ngbModalRef);
                });
            }
        });
    }

    eventSessionModalRef(component: Component, eventSession: EventSession): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.eventSession = eventSession;
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
