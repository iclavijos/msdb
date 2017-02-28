import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Series } from './series.model';
import { SeriesPopupService } from './series-popup.service';
import { SeriesService } from './series.service';

@Component({
    selector: 'jhi-series-delete-dialog',
    templateUrl: './series-delete-dialog.component.html'
})
export class SeriesDeleteDialogComponent {

    series: Series;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private seriesService: SeriesService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['series']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.seriesService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'seriesListModification',
                content: 'Deleted an series'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-series-delete-popup',
    template: ''
})
export class SeriesDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private seriesPopupService: SeriesPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.seriesPopupService
                .open(SeriesDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
