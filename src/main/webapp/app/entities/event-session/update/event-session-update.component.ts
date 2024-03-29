import { Component, OnInit, Inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEventSession } from '../event-session.model';
import { EventSessionService } from '../service/event-session.service';
import { DurationType } from 'app/shared/enumerations/durationType.enum';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  eventSession: IEventSession;
}

@Component({
  selector: 'jhi-event-session-update',
  templateUrl: './event-session-update.component.html',
})
export class EventSessionUpdateComponent implements OnInit {
  isSaving = false;
  isRaceAndLaps = false;
  eventSession!: IEventSession;
  sessionValues = SessionType;
  durationValues = DurationType;

  timeZone: any;

  editForm = this.fb.group({
    id: [],
    eventEdition: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    shortname: [null, [Validators.required, Validators.maxLength(10)]],
    sessionStartTime: [null, [Validators.required]],
    duration: [null, [Validators.required]],
    totalDuration: [],
    durationType: [null, [Validators.required]],
    additionalLap: [],
    sessionType: [null, [Validators.required]],
    maxDuration: [],
    location: [],
    cancelled: []
  });

  constructor(
    public dialogRef: MatDialogRef<EventSessionUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    protected eventSessionService: EventSessionService,
    protected fb: FormBuilder
  ) {
    this.eventSession = data.eventSession;

    if (!this.eventSession.eventEdition!.event?.rally && !this.eventSession.eventEdition!.event?.raid) {
      this.timeZone = this.eventSession.eventEdition!.trackLayout?.racetrack?.timeZone;
    } else if (this.eventSession.eventEdition!.event.rally) {
      this.timeZone = this.eventSession.eventEdition!.locationTimeZone;
    } else {
      this.timeZone = this.eventSession.locationTimeZone;
    }
 }

  ngOnInit(): void {
    if (this.eventSession.id === undefined) {
      this.eventSession.sessionStartTime = this.eventSession.eventEdition!.eventDate!.set({ second: 0, millisecond: 0});
    }

    this.updateForm(this.eventSession);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.isSaving = true;
    const eventSession = this.createFromForm();
    if (eventSession.id !== undefined) {
      this.subscribeToSaveResponse(this.eventSessionService.update(eventSession));
    } else {
      this.subscribeToSaveResponse(this.eventSessionService.create(eventSession));
    }
  }

  public onChangeType(event: any): void {
    const selectedType = parseInt(event.value, 10);
    this.isRaceAndLaps = selectedType >= 2 && this.editForm.get(['durationType'])!.value === 5;
  }

  getSessionValues(): string[] {
    const enumNames=[];
    for (const name in SessionType) {
        if (isNaN(Number(name))) {
           enumNames.push(name.toLowerCase());
       }
    }
    return enumNames;
  }

  getDurationValues(): string[] {
    const enumNames=[];
    for (const name in DurationType) {
        if (isNaN(Number(name))) {
           enumNames.push(name.toLowerCase());
       }
    }
    return enumNames;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventSession>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.dialogRef.close('updatedSession');
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(eventSession: IEventSession): void {
    this.editForm.patchValue({
      id: eventSession.id,
      name: eventSession.name,
      shortname: eventSession.shortname,
      sessionStartTime: eventSession.sessionStartTime?.setZone(this.timeZone).toISO({
        includeOffset: false
      }),
      duration: eventSession.duration,
      totalDuration: eventSession.totalDuration,
      durationType: eventSession.durationType,
      additionalLap: eventSession.additionalLap,
      sessionType: eventSession.sessionType,
      maxDuration: eventSession.maxDuration,
      location: eventSession.location,
      cancelled: eventSession.cancelled
    });
    this.isRaceAndLaps =
      (eventSession.sessionType! === SessionType.RACE || eventSession.sessionType! === SessionType.QUALIFYING_RACE) && eventSession.durationType === DurationType.LAPS;
    if (this.eventSession.eventEdition?.event?.rally || this.eventSession.eventEdition?.event?.raid) {
      this.editForm.get('durationType')!.disable();
      this.editForm.get('durationType')!.setValue(this.durationValues.KILOMETERS);
      this.editForm.get('sessionType')!.setValue(this.sessionValues.STAGE);
    }
  }

  protected createFromForm(): IEventSession {
    return {
      ...this.eventSession,
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      shortname: this.editForm.get(['shortname'])!.value,
      sessionStartTime: this.editForm.get(['sessionStartTime'])!.value,
      duration: this.editForm.get(['duration'])!.value,
      totalDuration: this.editForm.get(['totalDuration'])!.value,
      durationType: this.editForm.get(['durationType'])!.value,
      additionalLap: this.editForm.get(['additionalLap'])!.value,
      sessionType: this.editForm.get(['sessionType'])!.value,
      maxDuration: this.editForm.get(['maxDuration'])!.value,
      location: this.editForm.get(['location'])!.value,
      locationTimeZone: this.timeZone,
      cancelled: this.editForm.get(['cancelled'])!.value,
    };
  }
}
