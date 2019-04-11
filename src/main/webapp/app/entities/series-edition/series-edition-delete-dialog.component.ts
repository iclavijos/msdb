import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SeriesEdition } from './series-edition.model';
import { SeriesEditionPopupService } from './series-edition-popup.service';
import { SeriesEditionService } from './series-edition.service';

@Component({
    selector: 'jhi-series-edition-delete-dialog',
    templateUrl: './series-edition-delete-dialog.component.html'
})
export class SeriesEditionDeleteDialogComponent {

    seriesEdition: SeriesEdition;

    constructor(
        private seriesEditionService: SeriesEditionService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.seriesEditionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'seriesEditionListModification',
                content: 'Deleted an seriesEdition'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-series-edition-delete-popup',
    template: ''
})
export class SeriesEditionDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private seriesEditionPopupService: SeriesEditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.seriesEditionPopupService
                .open(SeriesEditionDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
