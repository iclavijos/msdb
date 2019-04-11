import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ISeriesEdition } from 'app/shared/model/series-edition.model';
import { SeriesEditionService } from './series-edition.service';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category';
import { ISeries } from 'app/shared/model/series.model';
import { SeriesService } from 'app/entities/series';

@Component({
    selector: 'jhi-series-edition-update',
    templateUrl: './series-edition-update.component.html'
})
export class SeriesEditionUpdateComponent implements OnInit {
    seriesEdition: ISeriesEdition;
    isSaving: boolean;

    categories: ICategory[];

    series: ISeries[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected seriesEditionService: SeriesEditionService,
        protected categoryService: CategoryService,
        protected seriesService: SeriesService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ seriesEdition }) => {
            this.seriesEdition = seriesEdition;
        });
        this.categoryService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICategory[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICategory[]>) => response.body)
            )
            .subscribe((res: ICategory[]) => (this.categories = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.seriesService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ISeries[]>) => mayBeOk.ok),
                map((response: HttpResponse<ISeries[]>) => response.body)
            )
            .subscribe((res: ISeries[]) => (this.series = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.seriesEdition.id !== undefined) {
            this.subscribeToSaveResponse(this.seriesEditionService.update(this.seriesEdition));
        } else {
            this.subscribeToSaveResponse(this.seriesEditionService.create(this.seriesEdition));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ISeriesEdition>>) {
        result.subscribe((res: HttpResponse<ISeriesEdition>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackCategoryById(index: number, item: ICategory) {
        return item.id;
    }

    trackSeriesById(index: number, item: ISeries) {
        return item.id;
    }
}
