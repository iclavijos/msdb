import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { finalize, switchMap, debounceTime, map } from 'rxjs/operators';

import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { AlertError } from 'app/shared/alert/alert-error.model';

import { IEventEntry } from '../event-entry.model';
import { EventEntryService } from '../service/event-entry.service';
import { ICategory } from 'app/entities/category/category.model';
import { IDriver } from 'app/entities/driver/driver.model';
import { DriverService } from 'app/entities/driver/service/driver.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { IEngine } from 'app/entities/engine/engine.model';
import { EngineService } from 'app/entities/engine/service/engine.service';
import { IChassis } from 'app/entities/chassis/chassis.model';
import { ChassisService } from 'app/entities/chassis/service/chassis.service';
import { ITyreProvider } from 'app/entities/tyre-provider/tyre-provider.model';
import { TyreProviderService } from 'app/entities/tyre-provider/service/tyre-provider.service';
import { IFuelProvider } from 'app/entities/fuel-provider/fuel-provider.model';
import { FuelProviderService } from 'app/entities/fuel-provider/service/fuel-provider.service';
import { DriverCategory } from 'app/shared/enumerations/driverCategory.enum';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-event-entry-update',
  templateUrl: './event-entry-update.component.html',
})
export class EventEntryUpdateComponent implements OnInit {
  isSaving = false;
  editForm: UntypedFormGroup;
  eventEntry: IEventEntry;

  driversOptions: Observable<IDriver[] | null> = new Observable();
  teamsOptions: Observable<ITeam[] | null> = new Observable();
  operatedByOptions: Observable<ITeam[] | null> = new Observable();
  chassisOptions: Observable<IChassis[] | null> = new Observable();
  engineOptions: Observable<IEngine[] | null> = new Observable();
  tyresOptions: Observable<ITyreProvider[] | null> = new Observable();
  fuelOptions: Observable<IFuelProvider[] | null> = new Observable();

  driversSearchTextChanged = new Subject<string>();

  categoryValues = DriverCategory;

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected elementRef: ElementRef,
    protected eventEntryService: EventEntryService,
    protected driverService: DriverService,
    protected teamService: TeamService,
    protected chassisService: ChassisService,
    protected engineService: EngineService,
    protected tyresProviderService: TyreProviderService,
    protected fuelProviderService: FuelProviderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<EventEntryUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.eventEntry = data.eventEntry;
    this.eventEntry.eventEdition = data.eventEdition;
    this.eventEntry.eventEdition!.allowedCategories = data.eventEdition.allowedCategories
      .sort((a: ICategory, b: ICategory) =>
        (a.name as string).localeCompare(b.name as string)) as ICategory[];
    this.editForm = this.fb.group({
      id: [],
      raceNumber: [null, [Validators.required]],
      entryName: [null, [Validators.required, Validators.maxLength(100)]],
      driversEntry: this.fb.array([
        this.fb.group({
          driver: '',
          rookie: false,
          category: 0
        })
      ]),
      team: [],
      operatedBy: [],
      chassis: [null, [Validators.required]],
      engine: [],
      tyres: [],
      fuel: [],
      category: [null, [Validators.required]],
      rookie: [],
      carImage: [],
      carImageContentType: [],
      carImageUrl: []
    });
  }

  ngOnInit(): void {
    this.displayFnDrivers = this.displayFnDrivers.bind(this);
    this.displayFnTeams = this.displayFnTeams.bind(this);
    this.displayFnChassis = this.displayFnChassis.bind(this);
    this.displayFnEngines = this.displayFnEngines.bind(this);
    this.displayFnTyres = this.displayFnTyres.bind(this);
    this.displayFnFuel = this.displayFnFuel.bind(this);

    this.driversOptions = this.driversSearchTextChanged.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.driverService.query({
            query: value
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.teamsOptions = this.editForm.get('team')!.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.teamService.query({
            query: value
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.operatedByOptions = this.editForm.get('operatedBy')!.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.teamService.query({
            query: value
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.engineOptions = this.editForm.get('engine')!.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.engineService.query({
            query: value
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.chassisOptions = this.editForm.get('chassis')!.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.chassisService.query({
            query: value
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.fuelOptions = this.editForm.get('fuel')!.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.fuelProviderService.query({
            query: value,
            sort: ['name,asc']
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.tyresOptions = this.editForm.get('tyres')!.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.tyresProviderService.query({
            query: value,
            sort: ['name,asc']
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.activatedRoute.data.subscribe(({ eventEntry }) => {
      this.updateForm(eventEntry);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventEntry = this.createFromForm();
    if (eventEntry.id !== undefined) {
      this.subscribeToSaveResponse(this.eventEntryService.update(eventEntry));
    } else {
      this.subscribeToSaveResponse(this.eventEntryService.create(eventEntry));
    }
  }

  displayFnDrivers(driver?: any): string {
    return driver ? driver.fullName as string : '';
  }

  displayFnTeams(team?: any): string {
    return team ? team.name as string : '';
  }

  displayFnChassis(chassis?: any): string {
    return chassis ? `${chassis.manufacturer as string} ${chassis.name as string}` : '';
  }

  displayFnEngines(engine?: any): string {
    return engine ? `${engine.manufacturer as string} ${engine.name as string}` : '';
  }

  displayFnTyres(tyres?: any): string {
    return tyres ? tyres.name as string : '';
  }

  displayFnFuel(fuel?: any): string {
    return fuel ? fuel.name as string : '';
  }

  addDriverEntry(): void {
    this.driversEntry.push(
      this.fb.group({
        driver: '',
        rookie: false,
        category: null
      })
    );
  }

  public searchDrivers(driverIndex: number): void {
    const searchText = this.editForm.controls.driversEntry.value[driverIndex].driver;

    if (searchText && searchText.length >= 3) {
      this.driversSearchTextChanged.next(searchText);
    }
  }

  removeDriverEntry(index: number): void {
    if (this.driversEntry.length > 1) {
      this.driversEntry.removeAt(index);
    }
  }

  selectedDriver(event: MatAutocompleteSelectedEvent, index: number): void {
    this.editForm.controls.driversEntry.value[index].driver = event.option.value;
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

  public allowedCategories(): ICategory[] {
    return this.eventEntry.eventEdition?.allowedCategories ?? [];
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventEntry>>): void {
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

  protected updateForm(eventEntry: IEventEntry): void {
    this.editForm.patchValue({
      id: eventEntry.id,
      raceNumber: eventEntry.raceNumber,
      entryName: eventEntry.entryName,
      team: eventEntry.team,
      operatedBy: eventEntry.operatedBy,
      chassis: eventEntry.chassis,
      engine: eventEntry.engine,
      tyres: eventEntry.tyres,
      fuel: eventEntry.fuel,
      carImage: eventEntry.carImage,
      carImageContentType: eventEntry.carImageContentType,
      carImageUrl: eventEntry.carImageUrl,
      category: this.allowedCategories().length === 1 ? this.allowedCategories()[0] : eventEntry.category
    });
    if ((eventEntry.drivers ?? []).length > 0) {
      this.driversEntry.removeAt(0);
    }
    eventEntry.drivers!.forEach(driverEntry =>
      this.driversEntry.push(
        this.fb.group({
          driver: driverEntry.driver,
          rookie: driverEntry.rookie,
          category: driverEntry.category!
        })
      )
    );
  }

  get driversEntry(): UntypedFormArray {
    return this.editForm.get('driversEntry') as UntypedFormArray;
  }

  protected createFromForm(): IEventEntry {
    return {
      ...this.eventEntry,
      id: this.editForm.get(['id'])!.value,
      raceNumber: this.editForm.get(['raceNumber'])!.value,
      entryName: this.editForm.get(['entryName'])!.value,
      drivers: this.editForm.get(['driversEntry'])!.value,
      team: this.editForm.get(['team'])!.value,
      operatedBy: this.editForm.get(['operatedBy'])!.value,
      chassis: this.editForm.get(['chassis'])!.value,
      engine: this.editForm.get(['engine'])!.value,
      tyres: this.editForm.get(['tyres'])!.value,
      fuel: this.editForm.get(['fuel'])!.value,
      carImage: this.editForm.get(['carImage'])!.value,
      carImageContentType: this.editForm.get(['carImageContentType'])!.value,
      carImageUrl: this.editForm.get(['carImageUrl'])!.value,
      category: this.editForm.get(['category'])!.value
    };
  }
}
