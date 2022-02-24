import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, debounceTime, finalize, map, filter } from 'rxjs/operators';

import { IRacetrack, Racetrack } from '../racetrack.model';
import { RacetrackService } from '../service/racetrack.service';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/country.service';
import { EventManager } from 'app/core/util/event-manager.service';

@Component({
  selector: 'jhi-racetrack-update',
  templateUrl: './racetrack-update.component.html',
})
export class RacetrackUpdateComponent implements OnInit {
  isSaving = false;
  isLoading = false;

  options: Observable<ICountry[] | null> = new Observable();

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    location: [null, [Validators.required, Validators.maxLength(100)]],
    country: [],
    timeZone: [],
    latitude: [],
    longitude: [],
    logo: [],
    logoContentType: [],
    logoUrl: []
  });

  constructor(
    protected eventManager: EventManager,
    protected racetrackService: RacetrackService,
    protected countryService: CountryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.options = this.editForm.get('country')!.valueChanges.pipe(
      debounceTime(300),
      filter(value => typeof value === 'string'),
      switchMap(value => this.countryService.searchCountries(value)),
      map(response => response.body)
    );

    this.activatedRoute.data.subscribe(({ racetrack }) => {
      this.updateForm(racetrack);
    });
  }

  displayFn(country?: ICountry): string {
    return country ? country.countryName! : '';
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
      country: racetrack.country,
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
      country: this.editForm.get(['country'])!.value,
      timeZone: this.editForm.get(['timeZone'])!.value,
      logoContentType: this.editForm.get(['logoContentType'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      logoUrl: this.editForm.get(['logoUrl'])!.value
    };
  }
}
