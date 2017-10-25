import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventEdition } from './event-edition.model';
import { EventEditionService } from './event-edition.service';

@Injectable()
export class EventEditionPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private eventEditionService: EventEditionService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.eventEditionService.find(id).subscribe((eventEdition) => {
                if (eventEdition.eventDate) {
                    eventEdition.eventDate = {
                        year: eventEdition.eventDate.getFullYear(),
                        month: eventEdition.eventDate.getMonth() + 1,
                        day: eventEdition.eventDate.getDate()
                    };
                }
                this.eventEditionModalRef(component, eventEdition);
            });
        } else {
            return this.eventEditionModalRef(component, new EventEdition());
        }
    }

    eventEditionModalRef(component: Component, eventEdition: EventEdition): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.eventEdition = eventEdition;
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
