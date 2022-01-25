import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, debounceTime, finalize, map, tap, startWith, distinctUntilChanged } from 'rxjs/operators';

import { IRacetrack, Racetrack } from '../racetrack.model';
import { RacetrackService } from '../service/racetrack.service';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/country.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-racetrack-update',
  templateUrl: './racetrack-update.component.html',
})
export class RacetrackUpdateComponent implements OnInit {
  isSaving = false;
  isLoading = false;

  options: Observable<ICountry[]> = new Observable();

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    location: [null, [Validators.required, Validators.maxLength(100)]],
    countryCode: [],
    timeZone: [],
    latitude: [],
    longitude: [],
    logo: [],
    logoContentType: [],
    logoUrl: []
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected racetrackService: RacetrackService,
    protected countryService: CountryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.options = this.editForm.get('countryCode')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => {
        if (typeof value !== 'object' && value !== null) {
          return this.countryService.searchCountries(value)
            .pipe(finalize(() => this.isLoading = false));
        } else {
          return [];
        }
      }),
      map(response => response.body as ICountry[])
    );

    this.activatedRoute.data.subscribe(({ racetrack }) => {
      this.updateForm(racetrack);
    });
  }

  displayFn(country?: ICountry): string {
    return country ? country.countryName! : '';
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
    const racetrack = this.createFromForm();
    if (racetrack.id !== undefined) {
      this.subscribeToSaveResponse(this.racetrackService.update(racetrack));
    } else {
      this.subscribeToSaveResponse(this.racetrackService.create(racetrack));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRacetrack>>): void {
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

  protected updateForm(racetrack: IRacetrack): void {
    this.editForm.patchValue({
      id: racetrack.id,
      name: racetrack.name,
      location: racetrack.location,
      latitude: racetrack.latitude,
      longitude: racetrack.longitude,
      countryCode: racetrack.countryCode,
      timeZone: racetrack.timeZone,
      logo: racetrack.logo,
      logoUrl: racetrack.logoUrl,
      logoContentType: racetrack.logoContentType
    });
  }

  protected createFromForm(): IRacetrack {
    return {
      ...new Racetrack(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      location: this.editForm.get(['location'])!.value,
      latitude: this.editForm.get(['latitude'])!.value,
      longitude: this.editForm.get(['longitude'])!.value,
      countryCode: this.editForm.get(['countryCode'])!.value.countryCode,
      timeZone: this.editForm.get(['timeZone'])!.value,
      logoContentType: this.editForm.get(['logoContentType'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      logoUrl: this.editForm.get(['logoUrl'])!.value
    };
  }
}
