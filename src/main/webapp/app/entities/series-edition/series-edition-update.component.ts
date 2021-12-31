import { Component, OnInit, Inject, ElementRef } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormGroup, FormControl, ValidationErrors, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { ICategory } from '../../shared/model/category.model';
import { CategoryService } from '../../entities/category/category.service';
import { IPointsSystem } from '../../shared/model/points-system.model';
import { PointsSystemService } from '../../entities/points-system/points-system.service';
import { ISeries } from '../../shared/model/series.model';
import { ISeriesEdition } from '../../shared/model/series-edition.model';
import { SeriesEditionService } from '../../entities/series-edition/series-edition.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-series-edition-update',
  templateUrl: './series-edition-update.component.html'
})
export class SeriesEditionUpdateComponent implements OnInit {
  isSaving: boolean;

  public editForm: FormGroup;

  categories: ICategory[];
  pointsSystems: IPointsSystem[];
  series: ISeries;
  seriesEdition: ISeriesEdition;

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected elementRef: ElementRef,
    protected seriesEditionService: SeriesEditionService,
    protected categoryService: CategoryService,
    protected pointsSystemService: PointsSystemService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SeriesEditionUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.series = data.series;
    this.seriesEdition = data.seriesEdition;

    this.editForm = this.fb.group({
      period: [null, [Validators.required, Validators.maxLength(10)]],
      numEvents: [null, [Validators.required]],
      singleChassis: [false],
      singleEngine: [false],
      singleTyre: [false],
      driversStandings: [false],
      teamsStandings: [false],
      manufacturersStandings: [false],
      editionName: [null, [Validators.required, Validators.maxLength(150)]],
      allowedCategories: [],
      standingsPerCategory: [false],
      pointsSystems: [],
      series: [],
      logo: [],
      logoContentType: [],
      logoUrl: []
    });
  }

  ngOnInit() {
    this.isSaving = false;
    this.updateForm(this.seriesEdition);

    this.categoryService
      .query({
        page: 0,
        size: 100
      })
      .pipe(
        filter((mayBeOk: HttpResponse<ICategory[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICategory[]>) => response.body)
      )
      .subscribe((res: ICategory[]) => (this.categories = res.sort((e1, e2) => (e1.name > e2.name ? 1 : -1))));

    this.pointsSystemService
      .query({
        page: 0,
        size: 100
      })
      .pipe(
        filter((mayBeOk: HttpResponse<ISeries[]>) => mayBeOk.ok),
        map((response: HttpResponse<ISeries[]>) => response.body)
      )
      .subscribe((res: IPointsSystem[]) => (this.pointsSystems = res.sort((e1, e2) => (e1.name > e2.name ? 1 : -1))));
  }

  updateForm(seriesEdition: ISeriesEdition) {
    this.editForm.patchValue({
      editionName: seriesEdition.editionName,
      period: seriesEdition.period,
      numEvents: seriesEdition.numEvents,
      singleChassis: seriesEdition.singleChassis,
      singleEngine: seriesEdition.singleEngine,
      singleTyre: seriesEdition.singleTyre,
      allowedCategories: seriesEdition.allowedCategories,
      driversStandings: seriesEdition.driversStandings,
      teamsStandings: seriesEdition.teamsStandings,
      manufacturersStandings: seriesEdition.manufacturersStandings,
      standingsPerCategory: seriesEdition.standingsPerCategory,
      pointsSystems: seriesEdition.pointsSystems,
      series: this.series,
      logo: seriesEdition.logo,
      logoContentType: seriesEdition.logoContentType,
      logoUrl: seriesEdition.logoUrl
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
      ...this.seriesEdition,
      editionName: this.editForm.get(['editionName']).value,
      period: this.editForm.get(['period']).value,
      numEvents: this.editForm.get(['numEvents']).value,
      singleChassis: this.editForm.get(['singleChassis']).value,
      singleEngine: this.editForm.get(['singleEngine']).value,
      singleTyre: this.editForm.get(['singleTyre']).value,
      allowedCategories: this.editForm.get(['allowedCategories']).value,
      driversStandings: this.editForm.get(['driversStandings']).value,
      teamsStandings: this.editForm.get(['teamsStandings']).value,
      manufacturersStandings: this.editForm.get(['manufacturersStandings']).value,
      standingsPerCategory: this.editForm.get(['standingsPerCategory']).value,
      pointsSystems: this.editForm.get(['pointsSystems']).value,
      series: this.editForm.get(['series']).value,
      logoContentType: this.editForm.get(['logoContentType']).value,
      logo: this.editForm.get(['logo']).value,
      logoUrl: this.editForm.get(['logoUrl']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISeriesEdition>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  private onSaveSuccess() {
    this.isSaving = false;
    this.dialogRef.close('ok');
  }

  private onSaveError() {
    this.isSaving = false;
  }

  close() {
    this.dialogRef.close();
  }

  compareCategories(c1: ICategory, c2: ICategory) {
    return c1 && c2 && c1.name === c2.name;
  }

  comparePointsSystems(p1: IPointsSystem, p2: IPointsSystem) {
    return p1 && p2 && p1.name === p2.name;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field: string, isImage) {
    return new Promise((resolve, reject) => {
      if (event && event.target && event.target.files && event.target.files[0]) {
        const file: File = event.target.files[0];
        if (isImage && !file.type.startsWith('image/')) {
          reject(`File was expected to be an image but was found to be ${file.type}`);
        } else {
          const filedContentType: string = field + 'ContentType';
          this.dataUtils.toBase64(file, base64Data => {
            this.editForm.patchValue({
              [field]: base64Data,
              [filedContentType]: file.type
            });
          });
        }
      } else {
        reject(`Base64 data was not set as file could not be extracted from passed parameter: ${event}`);
      }
    }).then(
      // eslint-disable-next-line no-console
      () => console.log('blob added'), // success
      this.onError
    );
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
