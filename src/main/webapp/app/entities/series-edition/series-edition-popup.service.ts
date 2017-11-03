import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Series, SeriesService } from '../series';
import { SeriesEdition } from './series-edition.model';
import { SeriesEditionService } from './series-edition.service';

import { EventEdition, EventEditionService } from '../event-edition';

@Injectable()
export class SeriesEditionPopupService {
    private ngbModalRef: NgbModalRef;

    private parentSeries: Series;
    private seriesEdition: SeriesEdition;
    
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private seriesEditionService: SeriesEditionService,
        private seriesService: SeriesService,
        private eventEditionService: EventEditionService,
    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any, idSeries?: number | any ): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }
            
            if (idSeries) {
                this.seriesService.find(idSeries).subscribe(series => this.parentSeries = series);
            }

            if (id) {
                this.seriesEditionService.find(id).subscribe((seriesEdition) => {
                    this.ngbModalRef = this.seriesEditionModalRef(component, seriesEdition);
                    resolve(this.ngbModalRef);
                });
            } else {
                this.seriesEdition = new SeriesEdition();
                this.seriesEdition.series = this.parentSeries;
                this.ngbModalRef = this.seriesEditionModalRef(component, this.seriesEdition);
                resolve(this.ngbModalRef);
            }
        });
    }
    
    openCalendar (component: Component, id: number, eventId?: number): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

	        this.seriesEditionService.find(id).subscribe(seriesEdition => {
	            if (eventId) {
	                this.eventEditionService.find(eventId).subscribe((eventEdition) => {
	                     this.ngbModalRef = this.seriesEditionModalRef(component, seriesEdition, eventEdition);
	                     resolve(this.ngbModalRef);
	                });
	            } else {
	                 this.ngbModalRef = this.seriesEditionModalRef(component, seriesEdition);
	                 resolve(this.ngbModalRef);
	            }
	        });
        });
    }

    seriesEditionModalRef(component: Component, seriesEdition: SeriesEdition, eventEdition?: EventEdition): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.seriesEdition = seriesEdition;
        if (eventEdition) {
            modalRef.componentInstance.eventEdition = eventEdition;
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
