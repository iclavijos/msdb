import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

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
        //this.jhiLanguageService.setLocations(['seriesEdition']);
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
    
    public addCategories() {
        if (!this.seriesEdition.allowedCategories) {
            this.seriesEdition.allowedCategories = [];
        }
        let availableCategories = document.getElementById('field_availableCategories') as HTMLSelectElement;
        let i: number;
        let options = availableCategories.options;
        for(i = 0; i < options.length; i++) {
            if (options[i].selected) {
                let index = this.findIndexOfAllowedCategory(+options[i].value);
                if (index === -1) {
                    this.categoryService.find(+options[i].value).subscribe(
                        (res) => { this.seriesEdition.allowedCategories.push(res); }, (res: Response) => this.onError(res.json()));
                }
            }
        }
    }
    
    public removeCategories() {
        let allowedCategories = document.getElementById('field_allowedCategories') as HTMLSelectElement;
        let i: number;
        for(i = allowedCategories.options.length - 1; i >= 0; i--) {
            if (allowedCategories.options[i].selected) {
                let index = this.findIndexOfAllowedCategory(Number(allowedCategories.options[i].value));
                this.seriesEdition.allowedCategories.splice(index, 1);
            }
        }
    }
    
    private findIndexOfAllowedCategory(value: number) {
        let i = 0;
        for (let category of this.seriesEdition.allowedCategories) {
            if (category.id === value) {
                return i;
            }
            i++;
        }
        return -1;
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
                    .open(SeriesEditionDialogComponent, null, params['idSeries']);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
