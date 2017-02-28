import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventEntry } from './event-entry.model';
import { EventEntryService } from './event-entry.service';
@Injectable()
export class EventEntryPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private eventEntryService: EventEntryService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.eventEntryService.find(id).subscribe(eventEntry => {
                this.eventEntryModalRef(component, eventEntry);
            });
        } else {
            return this.eventEntryModalRef(component, new EventEntry());
        }
    }

    eventEntryModalRef(component: Component, eventEntry: EventEntry): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.eventEntry = eventEntry;
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
