import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISeriesEdition, SeriesEdition } from '../series-edition.model';
import { SeriesEditionService } from '../service/series-edition.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { ISeries } from 'app/entities/series/series.model';
import { SeriesService } from 'app/entities/series/service/series.service';

@Component({
  selector: 'jhi-series-edition-update',
  templateUrl: './series-edition-update.component.html',
})
export class SeriesEditionUpdateComponent implements OnInit {
  isSaving = false;

  categoriesSharedCollection: ICategory[] = [];
  seriesSharedCollection: ISeries[] = [];

  editForm = this.fb.group({
    id: [],
    period: [null, [Validators.required, Validators.maxLength(10)]],
    singleChassis: [null, [Validators.required]],
    singleEngine: [null, [Validators.required]],
    singleTyre: [null, [Validators.required]],
    allowedCategories: [],
    series: [],
  });

  constructor(
    protected seriesEditionService: SeriesEditionService,
    protected categoryService: CategoryService,
    protected seriesService: SeriesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ seriesEdition }) => {
      this.updateForm(seriesEdition);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const seriesEdition = this.createFromForm();
    if (seriesEdition.id !== undefined) {
      this.subscribeToSaveResponse(this.seriesEditionService.update(seriesEdition));
    } else {
      this.subscribeToSaveResponse(this.seriesEditionService.create(seriesEdition));
    }
  }

  trackCategoryById(index: number, item: ICategory): number {
    return item.id!;
  }

  trackSeriesById(index: number, item: ISeries): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISeriesEdition>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(seriesEdition: ISeriesEdition): void {
    this.editForm.patchValue({
      id: seriesEdition.id,
      period: seriesEdition.period,
      singleChassis: seriesEdition.singleChassis,
      singleEngine: seriesEdition.singleEngine,
      singleTyre: seriesEdition.singleTyre,
      allowedCategories: seriesEdition.allowedCategories,
      series: seriesEdition.series,
    });

    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing(
      this.categoriesSharedCollection,
      seriesEdition.allowedCategories
    );
    this.seriesSharedCollection = this.seriesService.addSeriesToCollectionIfMissing(this.seriesSharedCollection, seriesEdition.series);
  }

  protected loadRelationshipsOptions(): void {
    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing(categories, this.editForm.get('allowedCategories')!.value)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));

    this.seriesService
      .query()
      .pipe(map((res: HttpResponse<ISeries[]>) => res.body ?? []))
      .pipe(map((series: ISeries[]) => this.seriesService.addSeriesToCollectionIfMissing(series, this.editForm.get('series')!.value)))
      .subscribe((series: ISeries[]) => (this.seriesSharedCollection = series));
  }

  protected createFromForm(): ISeriesEdition {
    return {
      ...new SeriesEdition(),
      id: this.editForm.get(['id'])!.value,
      period: this.editForm.get(['period'])!.value,
      singleChassis: this.editForm.get(['singleChassis'])!.value,
      singleEngine: this.editForm.get(['singleEngine'])!.value,
      singleTyre: this.editForm.get(['singleTyre'])!.value,
      allowedCategories: this.editForm.get(['allowedCategories'])!.value,
      series: this.editForm.get(['series'])!.value,
    };
  }
}
