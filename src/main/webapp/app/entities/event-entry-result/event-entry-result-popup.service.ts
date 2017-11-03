import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventEdition } from '../event-edition';
import { EventSession, EventSessionService } from '../event-session';
import { EventEntry } from '../event-entry';
import { EventEntryResult } from './event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';

@Injectable()
export class EventEntryResultPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private eventEntryResultService: EventEntryResultService,
        private eventSessionService: EventSessionService
    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, idSession?: number | any, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.eventEntryResultService.find(id).subscribe((eventEntryResult) => {
                    this.ngbModalRef = this.eventEntryResultModalRef(component, eventEntryResult);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.eventEntryResultModalRef(component, new EventEntryResult(), idSession);
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }
    
    openUploadDialog(component: Component, idSession?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }
            
            this.eventSessionService.find(idSession).subscribe(eventSessionResult => {
                this.ngbModalRef = this.eventSessionUploadResultModalRef(component, eventSessionResult);
                resolve(this.ngbModalRef);
            });
        });
    }

    eventEntryResultModalRef(component: Component, eventEntryResult: EventEntryResult, idSession?: number | any): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.eventEntryResult = eventEntryResult;
        if (!eventEntryResult.id) {
            eventEntryResult.session = new EventSession();
            eventEntryResult.session.id = idSession;
        }
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
    
    eventSessionUploadResultModalRef(component: Component, eventSession: EventSession): NgbModalRef {
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
