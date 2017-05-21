import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Series, SeriesService } from '../series';
import { SeriesEdition } from './series-edition.model';
import { SeriesEditionService } from './series-edition.service';

@Injectable()
export class SeriesEditionPopupService {
    private isOpen = false;
    private parentSeries: Series;
    private seriesEdition: SeriesEdition;
    
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private seriesEditionService: SeriesEditionService,
        private seriesService: SeriesService
    ) {}

    open (component: Component, id?: number | any, idSeries?: number | any ): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        
        if (idSeries) {
            this.seriesService.find(idSeries).subscribe(series => this.parentSeries = series);
        }

        if (id) {
            this.seriesEditionService.find(id).subscribe(seriesEdition => {
                this.seriesEditionModalRef(component, seriesEdition);
            });
        } else {
            this.seriesEdition = new SeriesEdition();
            this.seriesEdition.series = this.parentSeries;
            return this.seriesEditionModalRef(component, this.seriesEdition);
        }
    }
    
    openCalendar (component: Component, id: number): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        this.seriesEditionService.find(id).subscribe(seriesEdition => {
            this.seriesEditionModalRef(component, seriesEdition);
        });

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
