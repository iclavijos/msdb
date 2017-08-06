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
import { PointsSystem, PointsSystemService } from '../points-system';
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
    pointsSystems: PointsSystem[];

    series: Series[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private seriesEditionService: SeriesEditionService,
        private categoryService: CategoryService,
        private seriesService: SeriesService,
        private pointsSystemService: PointsSystemService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_EDITOR', 'ROLE_ADMIN'];
        this.categoryService.query({
            page: 0,
            query: '',
            size: 100,
            sort: ['name','asc']})
            .subscribe((res: ResponseWrapper) => { this.categories = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.seriesService.query()
            .subscribe((res: ResponseWrapper) => { this.series = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.pointsSystemService.query({
            page: 0,
            query: '',
            size: 100,
            sort: ['name','asc']})
            .subscribe((res: ResponseWrapper) => { this.pointsSystems = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }
    clear () {
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
            isCreated ? 'motorsportsDatabaseApp.series.seriesEdition.created'
            : 'motorsportsDatabaseApp.series.seriesEdition.updated',
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
    
    public addPointsSystem() {
        if (!this.seriesEdition.pointsSystems) {
            this.seriesEdition.pointsSystems = [];
        }
        let pointsSystems = document.getElementById('field_availablePointsSystems') as HTMLSelectElement;
        let i: number;
        let options = pointsSystems.options;
        for(i = 0; i < options.length; i++) {
            if (options[i].selected) {
                let index = this.findIndexOfPointsSystem(+options[i].value);
                if (index === -1) {
                    this.pointsSystemService.find(+options[i].value).subscribe(
                        (res) => { this.seriesEdition.pointsSystems.push(res); }, (res: Response) => this.onError(res.json()));
                }
            }
        }
    }
    
    public removePointsSystem() {
        let pointsSystems = document.getElementById('field_pointsSystems') as HTMLSelectElement;
        let i: number;
        for(i = pointsSystems.options.length - 1; i >= 0; i--) {
            if (pointsSystems.options[i].selected) {
                let index = this.findIndexOfPointsSystem(Number(pointsSystems.options[i].value));
                this.seriesEdition.pointsSystems.splice(index, 1);
            }
        }
    }
    
    private findIndexOfPointsSystem(value: number) {
        let i = 0;
        for (let pointsSystem of this.seriesEdition.pointsSystems) {
            if (pointsSystem.id === value) {
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
                    .open(SeriesEditionDialogComponent, null, params['idSeries']);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
