import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventEntry } from './event-entry.model';
import { EventEdition } from '../event-edition';
import { EventEntryService } from './event-entry.service';
@Injectable()
export class EventEntryPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private eventEntryService: EventEntryService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, idEdition?: number | any, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.eventEntryService.find(id).subscribe((eventEntry) => {
                    this.ngbModalRef = this.eventEntryModalRef(component, eventEntry);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.eventEntryModalRef(component, new EventEntry(), idEdition);
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    eventEntryModalRef(component: Component, eventEntry: EventEntry, idEdition?: number | any): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.eventEntry = eventEntry;
        if (!eventEntry.id) {
            eventEntry.eventEdition = new EventEdition();
            eventEntry.eventEdition.id = idEdition;
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
}
