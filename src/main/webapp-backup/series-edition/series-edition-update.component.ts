import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ISeriesEdition, SeriesEdition } from 'app/shared/model/series-edition.model';
import { SeriesEditionService } from './series-edition.service';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category/category.service';
import { ISeries } from 'app/shared/model/series.model';
import { SeriesService } from 'app/entities/series/series.service';

@Component({
  selector: 'jhi-series-edition-update',
  templateUrl: './series-edition-update.component.html'
})
export class SeriesEditionUpdateComponent implements OnInit {
  isSaving: boolean;

  categories: ICategory[];

  series: ISeries[];

  editForm = this.fb.group({
    id: [],
    period: [null, [Validators.required, Validators.maxLength(10)]],
    singleChassis: [null, [Validators.required]],
    singleEngine: [null, [Validators.required]],
    singleTyre: [null, [Validators.required]],
    allowedCategories: [],
    series: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected seriesEditionService: SeriesEditionService,
    protected categoryService: CategoryService,
    protected seriesService: SeriesService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ seriesEdition }) => {
      this.updateForm(seriesEdition);
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

  updateForm(seriesEdition: ISeriesEdition) {
    this.editForm.patchValue({
      id: seriesEdition.id,
      period: seriesEdition.period,
      singleChassis: seriesEdition.singleChassis,
      singleEngine: seriesEdition.singleEngine,
      singleTyre: seriesEdition.singleTyre,
      allowedCategories: seriesEdition.allowedCategories,
      series: seriesEdition.series
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const seriesEdition = this.createFromForm();
    if (seriesEdition.id !== undefined) {
      this.subscribeToSaveResponse(this.seriesEditionService.update(seriesEdition));
    } else {
      this.subscribeToSaveResponse(this.seriesEditionService.create(seriesEdition));
    }
  }

  private createFromForm(): ISeriesEdition {
    return {
      ...new SeriesEdition(),
      id: this.editForm.get(['id']).value,
      period: this.editForm.get(['period']).value,
      singleChassis: this.editForm.get(['singleChassis']).value,
      singleEngine: this.editForm.get(['singleEngine']).value,
      singleTyre: this.editForm.get(['singleTyre']).value,
      allowedCategories: this.editForm.get(['allowedCategories']).value,
      series: this.editForm.get(['series']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISeriesEdition>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
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
