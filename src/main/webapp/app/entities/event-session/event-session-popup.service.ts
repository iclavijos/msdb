import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { EventSession } from './event-session.model';
import { EventSessionService } from './event-session.service';

@Injectable()
export class EventSessionPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private eventSessionService: EventSessionService

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
                this.eventSessionService.find(id).subscribe((eventSession) => {
                    eventSession.sessionStartTime = this.datePipe
                        .transform(eventSession.sessionStartTime, 'yyyy-MM-ddTHH:mm:ss');
                    this.ngbModalRef = this.eventSessionModalRef(component, eventSession);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.eventSessionModalRef(component, new EventSession());
                    resolve(this.ngbModalRef);
                }, 0);
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
