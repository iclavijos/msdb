import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormGroup, FormControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, debounceTime, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IEventEntry } from 'app/shared/model/event-entry.model';
import { EventEntryService } from './event-entry.service';
import { IDriver } from 'app/shared/model/driver.model';
import { DriverService } from 'app/entities/driver/driver.service';
import { ITeam } from 'app/shared/model/team.model';
import { TeamService } from 'app/entities/team/team.service';
import { IEngine } from 'app/shared/model/engine.model';
import { EngineService } from 'app/entities/engine/engine.service';
import { IChassis } from 'app/shared/model/chassis.model';
import { ChassisService } from 'app/entities/chassis/chassis.service';
import { ITyreProvider } from 'app/shared/model/tyre-provider.model';
import { TyreProviderService } from 'app/entities/tyre-provider/tyre-provider.service';
import { IFuelProvider } from 'app/shared/model/fuel-provider.model';
import { FuelProviderService } from 'app/entities/fuel-provider/fuel-provider.service';

import { MatAutocompleteSelectedEvent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './event-entry-update.component.html'
})
export class EventEntryUpdateComponent implements OnInit {
  editForm: FormGroup;
  isSaving: boolean;
  eventEntry: IEventEntry;

  driversOptions: Observable<IDriver[]>;
  teamsOptions: Observable<ITeam[]>;
  operatedByOptions: Observable<ITeam[]>;
  chassisOptions: Observable<IChassis[]>;
  engineOptions: Observable<IEngine[]>;
  tyresOptions: Observable<ITyreProvider[]>;
  fuelOptions: Observable<IFuelProvider[]>;

  selectedDrivers: IDriver[] = [];

  @ViewChild('driverInput', { static: false }) driversInput: ElementRef;
  driverCtrl = new FormControl();

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected elementRef: ElementRef,
    protected eventEntryService: EventEntryService,
    protected driverService: DriverService,
    protected teamService: TeamService,
    protected chassisService: ChassisService,
    protected engineService: EngineService,
    protected tyresProviderService: TyreProviderService,
    protected fuelProviderService: FuelProviderService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventEntryUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.eventEntry = data.eventEntry;
    this.eventEntry.eventEdition = data.eventEdition;
    this.editForm = this.fb.group({
      id: [],
      raceNumber: [null, [Validators.required]],
      entryName: [null, [Validators.required, Validators.maxLength(100)]],
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

  ngOnInit() {
    this.isSaving = false;

    this.displayFnTeams = this.displayFnTeams.bind(this);
    this.displayFnChassis = this.displayFnChassis.bind(this);
    this.displayFnEngines = this.displayFnEngines.bind(this);
    this.displayFnTyres = this.displayFnTyres.bind(this);
    this.displayFnFuel = this.displayFnFuel.bind(this);

    this.driversOptions = this.driverCtrl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.driverService.query({
            query: value,
            sort: ['surname,asc', 'name,asc']
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.teamsOptions = this.editForm.get('team').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.teamService.query({
            query: value,
            sort: ['name,asc']
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.operatedByOptions = this.editForm.get('operatedBy').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.teamService.query({
            query: value,
            sort: ['name,asc']
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.engineOptions = this.editForm.get('engine').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.engineService.query({
            query: value,
            sort: ['name,asc', 'manufacturer,asc']
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.chassisOptions = this.editForm.get('chassis').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.chassisService.query({
            query: value,
            sort: ['name,asc', 'manufacturer,asc']
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    this.fuelOptions = this.editForm.get('fuel').valueChanges.pipe(
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

    this.tyresOptions = this.editForm.get('tyres').valueChanges.pipe(
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

    this.updateForm(this.eventEntry);
  }

  updateForm(eventEntry: IEventEntry) {
    this.selectedDrivers = eventEntry.drivers;
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
      category: eventEntry.eventEdition.allowedCategories.length === 1 ? eventEntry.eventEdition.allowedCategories[0] : null
    });
  }

  private createFromForm(): IEventEntry {
    return {
      ...this.eventEntry,
      id: this.editForm.get(['id']).value,
      raceNumber: this.editForm.get(['raceNumber']).value,
      entryName: this.editForm.get(['entryName']).value,
      drivers: this.selectedDrivers,
      team: this.editForm.get(['team']).value,
      operatedBy: this.editForm.get(['operatedBy']).value,
      chassis: this.editForm.get(['chassis']).value,
      engine: this.editForm.get(['engine']).value,
      tyres: this.editForm.get(['tyres']).value,
      fuel: this.editForm.get(['fuel']).value,
      carImage: this.editForm.get(['carImage']).value,
      carImageContentType: this.editForm.get(['carImageContentType']).value,
      carImageUrl: this.editForm.get(['carImageUrl']).value,
      category: this.editForm.get(['category']).value
    };
  }

  save() {
    this.isSaving = true;
    const eventEntry = this.createFromForm();
    if (eventEntry.id !== undefined) {
      this.subscribeToSaveResponse(this.eventEntryService.update(eventEntry));
    } else {
      this.subscribeToSaveResponse(this.eventEntryService.create(eventEntry));
    }
  }

  close() {
    this.dialogRef.close();
  }

  displayFnTeams(team?: any): string | undefined {
    return team ? team.name : undefined;
  }

  displayFnChassis(chassis?: any): string | undefined {
    return chassis ? chassis.manufacturer + ' ' + chassis.name : undefined;
  }

  displayFnEngines(engine?: any): string | undefined {
    return engine ? engine.manufacturer + ' ' + engine.name : undefined;
  }

  displayFnTyres(tyres?: any): string | undefined {
    return tyres ? tyres.name : undefined;
  }

  displayFnFuel(fuel?: any): string | undefined {
    return fuel ? fuel.name : undefined;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventEntry>>) {
    return result.subscribe(
      res => {
        this.isSaving = false;
        this.dialogRef.close(res);
      },
      () => {
        this.isSaving = false;
        return;
      }
    );
  }

  protected onSaveSuccess() {
    this.isSaving = false;
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  removeDriver(driver: IDriver): void {
    const index = this.selectedDrivers.indexOf(driver);

    if (index >= 0) {
      this.selectedDrivers.splice(index, 1);
    }
  }

  selectedDriver(event: MatAutocompleteSelectedEvent): void {
    if (this.eventEntry.eventEdition.multidriver) {
      this.selectedDrivers.push(event.option.value);
    } else {
      this.selectedDrivers = [event.option.value];
    }

    this.driversInput.nativeElement.value = null;
    this.driverCtrl.setValue(null);
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
      () => {}, // success
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
}
