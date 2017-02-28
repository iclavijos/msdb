import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { SeriesEdition } from './series-edition.model';
import { SeriesEditionPopupService } from './series-edition-popup.service';
import { SeriesEditionService } from './series-edition.service';
import { Category, CategoryService } from '../category';
import { Series, SeriesService } from '../series';
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
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private seriesEditionService: SeriesEditionService,
        private categoryService: CategoryService,
        private seriesService: SeriesService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['seriesEdition']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.categoryService.query().subscribe(
            (res: Response) => { this.categories = res.json(); }, (res: Response) => this.onError(res.json()));
        this.seriesService.query().subscribe(
            (res: Response) => { this.series = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.seriesEdition.id !== undefined) {
            this.seriesEditionService.update(this.seriesEdition)
                .subscribe((res: SeriesEdition) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.seriesEditionService.create(this.seriesEdition)
                .subscribe((res: SeriesEdition) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: SeriesEdition) {
        this.eventManager.broadcast({ name: 'seriesEditionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
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

    constructor (
        private route: ActivatedRoute,
        private seriesEditionPopupService: SeriesEditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
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
