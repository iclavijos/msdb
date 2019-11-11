import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventEdition } from './event-edition.model';
import { EventEditionService } from './event-edition.service';

@Injectable()
export class EventEditionPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private eventEditionService: EventEditionService

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
                this.eventEditionService.find(id).subscribe((eventEdition) => {
                    if (eventEdition.eventDate) {
                        eventEdition.eventDate = {
                            year: eventEdition.eventDate.getFullYear(),
                            month: eventEdition.eventDate.getMonth() + 1,
                            day: eventEdition.eventDate.getDate()
                        };
                    }
                    this.ngbModalRef = this.eventEditionModalRef(component, eventEdition);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.eventEditionModalRef(component, new EventEdition());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    eventEditionModalRef(component: Component, eventEdition: EventEdition): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.eventEdition = eventEdition;
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
