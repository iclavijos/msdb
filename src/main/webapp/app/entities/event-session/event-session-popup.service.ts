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
    private isOpen = false;
    
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private eventSessionService: EventSessionService,
        private eventEditionService: EventEditionService,
    ) {}

    open (component: Component, id?: number | any, idEdition?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true; 
        
        if (id) {
            this.eventSessionService.find(id).subscribe(eventSession => {
                eventSession.sessionStartTime = moment(eventSession.sessionStartTime*1000)
                    .tz(eventSession.eventEdition.trackLayout.racetrack.timeZone).format("YYYY-MM-DDTHH:mm");
                this.eventSessionModalRef(component, eventSession);
            });
        } else {
            this.eventEditionService.find(idEdition).subscribe(eventEdition => {
                let eventSess = new EventSession();
                eventSess.eventEdition = eventEdition;
                return this.eventSessionModalRef(component, eventSess);
            });
        }
    }

    eventSessionModalRef(component: Component, eventSession: EventSession): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.eventSession = eventSession;
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
