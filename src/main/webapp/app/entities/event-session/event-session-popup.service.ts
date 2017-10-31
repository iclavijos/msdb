import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { EventSession } from './event-session.model';
import { EventSessionService } from './event-session.service';

@Injectable()
export class EventSessionPopupService {
    private isOpen = false;
    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private eventSessionService: EventSessionService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.eventSessionService.find(id).subscribe((eventSession) => {
                eventSession.sessionStartTime = this.datePipe
                    .transform(eventSession.sessionStartTime, 'yyyy-MM-ddThh:mm');
                this.eventSessionModalRef(component, eventSession);
            });
        } else {
            return this.eventSessionModalRef(component, new EventSession());
        }
    }

    eventSessionModalRef(component: Component, eventSession: EventSession): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.eventSession = eventSession;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
