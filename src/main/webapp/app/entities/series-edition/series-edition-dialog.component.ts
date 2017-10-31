import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SeriesEdition } from './series-edition.model';
import { SeriesEditionPopupService } from './series-edition-popup.service';
import { SeriesEditionService } from './series-edition.service';
import { Category, CategoryService } from '../category';
import { Series, SeriesService } from '../series';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-series-edition-dialog',
    templateUrl: './series-edition-dialog.component.html'
})
export class SeriesEditionDialogComponent implements OnInit {

    seriesEdition: SeriesEdition;
    isSaving: boolean;

    categories: Category[];

    series: Series[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private seriesEditionService: SeriesEditionService,
        private categoryService: CategoryService,
        private seriesService: SeriesService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.categoryService.query()
            .subscribe((res: ResponseWrapper) => { this.categories = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.seriesService.query()
            .subscribe((res: ResponseWrapper) => { this.series = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.seriesEdition.id !== undefined) {
            this.subscribeToSaveResponse(
                this.seriesEditionService.update(this.seriesEdition));
        } else {
            this.subscribeToSaveResponse(
                this.seriesEditionService.create(this.seriesEdition));
        }
    }

    private subscribeToSaveResponse(result: Observable<SeriesEdition>) {
        result.subscribe((res: SeriesEdition) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: SeriesEdition) {
        this.eventManager.broadcast({ name: 'seriesEditionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackCategoryById(index: number, item: Category) {
        return item.id;
    }

    trackSeriesById(index: number, item: Series) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-series-edition-popup',
    template: ''
})
export class SeriesEditionPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private seriesEditionPopupService: SeriesEditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.seriesEditionPopupService
                    .open(SeriesEditionDialogComponent as Component, params['id']);
            } else {
                this.seriesEditionPopupService
                    .open(SeriesEditionDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
