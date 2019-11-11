import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventEntryResult } from './event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';

@Injectable()
export class EventEntryResultPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private eventEntryResultService: EventEntryResultService

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
                this.eventEntryResultService.find(id).subscribe((eventEntryResult) => {
                    this.ngbModalRef = this.eventEntryResultModalRef(component, eventEntryResult);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.eventEntryResultModalRef(component, new EventEntryResult());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    eventEntryResultModalRef(component: Component, eventEntryResult: EventEntryResult): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.eventEntryResult = eventEntryResult;
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
