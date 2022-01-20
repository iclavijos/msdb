import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, debounceTime, map, finalize } from 'rxjs/operators';

import { IDriver, Driver } from '../driver.model';
import { DriverService } from '../service/driver.service';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/country.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-driver-update',
  templateUrl: './driver-update.component.html',
})
export class DriverUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(40)]],
    surname: [null, [Validators.required, Validators.maxLength(60)]],
    birthDate: [],
    birthPlace: [null, [Validators.maxLength(75)]],
    deathDate: [],
    deathPlace: [null, [Validators.maxLength(75)]],
    portrait: [],
    portraitContentType: [],
    portraitUrl: [],
    nationality: []
  });

  options: Observable<ICountry[] | null> = new Observable();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected driverService: DriverService,
    protected countryService: CountryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.displayFn = this.displayFn.bind(this);

    this.options = this.editForm.get('nationality')!.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.countryService.searchCountries(value)),
      map(response => response.body)
    );

    this.activatedRoute.data.subscribe(({ driver }) => {
      this.updateForm(driver);
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('motorsportsDatabaseApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const driver = this.createFromForm();
    if (driver.id !== undefined) {
      this.subscribeToSaveResponse(this.driverService.update(driver));
    } else {
      this.subscribeToSaveResponse(this.driverService.create(driver));
    }
  }

  displayFn(country?: ICountry): string {
    return country ? country.countryName as string : '';
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDriver>>): void {
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

  protected updateForm(driver: IDriver): void {
    this.editForm.patchValue({
      id: driver.id,
      name: driver.name,
      surname: driver.surname,
      birthDate: driver.birthDate,
      birthPlace: driver.birthPlace,
      deathDate: driver.deathDate,
      deathPlace: driver.deathPlace,
      portrait: driver.portrait,
      portraitContentType: driver.portraitContentType,
      portraitUrl: driver.portraitUrl,
      nationality: driver.nationality
    });
  }

  protected createFromForm(): IDriver {
    const driver = new Driver();
    driver.id = this.editForm.get(['id'])!.value;
    driver.name = this.editForm.get(['name'])!.value;
    driver.surname = this.editForm.get(['surname'])!.value;
    driver.birthDate = this.editForm.get(['birthDate'])!.value;
    driver.birthPlace = this.editForm.get(['birthPlace'])!.value;
    driver.deathDate = this.editForm.get(['deathDate'])!.value;
    driver.deathPlace = this.editForm.get(['deathPlace'])!.value;
    driver.portraitContentType = this.editForm.get(['portraitContentType'])!.value;
    driver.portrait = this.editForm.get(['portrait'])!.value;
    driver.portraitUrl = this.editForm.get(['portraitUrl'])!.value;
    driver.nationality = this.editForm.get(['nationality'])!.value;
    return driver;
  }
}
