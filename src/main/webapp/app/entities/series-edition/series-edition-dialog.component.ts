import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
    authorities: any[];
    isSaving: boolean;

    categories: Category[];

    series: Series[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private seriesEditionService: SeriesEditionService,
        private categoryService: CategoryService,
        private seriesService: SeriesService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
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
                this.seriesEditionService.update(this.seriesEdition), false);
        } else {
            this.subscribeToSaveResponse(
                this.seriesEditionService.create(this.seriesEdition), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<SeriesEdition>, isCreated: boolean) {
        result.subscribe((res: SeriesEdition) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: SeriesEdition, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'motorsportsDatabaseApp.seriesEdition.created'
            : 'motorsportsDatabaseApp.seriesEdition.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'seriesEditionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
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

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private seriesEditionPopupService: SeriesEditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.seriesEditionPopupService
                    .open(SeriesEditionDialogComponent, params['id']);
            } else {
                this.modalRef = this.seriesEditionPopupService
                    .open(SeriesEditionDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
