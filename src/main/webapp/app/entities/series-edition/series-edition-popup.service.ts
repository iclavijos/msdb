import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SeriesEdition } from './series-edition.model';
import { SeriesEditionService } from './series-edition.service';
@Injectable()
export class SeriesEditionPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private seriesEditionService: SeriesEditionService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.seriesEditionService.find(id).subscribe(seriesEdition => {
                this.seriesEditionModalRef(component, seriesEdition);
            });
        } else {
            return this.seriesEditionModalRef(component, new SeriesEdition());
        }
    }

    seriesEditionModalRef(component: Component, seriesEdition: SeriesEdition): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.seriesEdition = seriesEdition;
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
