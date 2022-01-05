import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEventEntry, EventEntry } from '../event-entry.model';
import { EventEntryService } from '../service/event-entry.service';
import { IDriver } from 'app/entities/driver/driver.model';
import { DriverService } from 'app/entities/driver/service/driver.service';

@Component({
  selector: 'jhi-event-entry-update',
  templateUrl: './event-entry-update.component.html',
})
export class EventEntryUpdateComponent implements OnInit {
  isSaving = false;

  driversSharedCollection: IDriver[] = [];

  editForm = this.fb.group({
    id: [],
    teamName: [null, [Validators.required, Validators.maxLength(100)]],
    driver: [],
  });

  constructor(
    protected eventEntryService: EventEntryService,
    protected driverService: DriverService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventEntry }) => {
      this.updateForm(eventEntry);

      this.loadRelationshipsOptions();
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

  trackDriverById(index: number, item: IDriver): number {
    return item.id!;
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
      teamName: eventEntry.teamName,
      driver: eventEntry.driver,
    });

    this.driversSharedCollection = this.driverService.addDriverToCollectionIfMissing(this.driversSharedCollection, eventEntry.driver);
  }

  protected loadRelationshipsOptions(): void {
    this.driverService
      .query()
      .pipe(map((res: HttpResponse<IDriver[]>) => res.body ?? []))
      .pipe(map((drivers: IDriver[]) => this.driverService.addDriverToCollectionIfMissing(drivers, this.editForm.get('driver')!.value)))
      .subscribe((drivers: IDriver[]) => (this.driversSharedCollection = drivers));
  }

  protected createFromForm(): IEventEntry {
    return {
      ...new EventEntry(),
      id: this.editForm.get(['id'])!.value,
      teamName: this.editForm.get(['teamName'])!.value,
      driver: this.editForm.get(['driver'])!.value,
    };
  }
}
