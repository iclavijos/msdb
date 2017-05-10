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
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private eventEntryResultService: EventEntryResultService,
        private eventSessionService: EventSessionService
    ) {}

    open (component: Component, idSession?: number | any, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.eventEntryResultService.find(id).subscribe(eventEntryResult => {
                this.eventEntryResultModalRef(component, eventEntryResult);
            });
        } else {
            return this.eventEntryResultModalRef(component, new EventEntryResult(), idSession);
        }
    }
    
    openUploadDialog(component: Component, idSession?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        this.eventSessionService.find(idSession).subscribe(eventSessionResult => {
            this.eventSessionUploadResultModalRef(component, eventSessionResult);
        });

    }

    eventEntryResultModalRef(component: Component, eventEntryResult: EventEntryResult, idSession?: number | any): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.eventEntryResult = eventEntryResult;
        if (!eventEntryResult.id) {
            eventEntryResult.session = new EventSession();
            eventEntryResult.session.id = idSession;
        }
        modalRef.result.then(result => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
    
    eventSessionUploadResultModalRef(component: Component, eventSession: EventSession): NgbModalRef {
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
