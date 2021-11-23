import { Component, OnInit, Inject } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { IEventSession } from 'app/shared/model/event-session.model';
import { EventSessionService } from './event-session.service';

import { DurationType } from 'app/shared/enumerations/durationType.enum';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-event-session-update',
  templateUrl: './event-session-update.component.html'
})
export class EventSessionUpdateComponent implements OnInit {
  isSaving: boolean;
  isRaceAndLaps = false;

  private eventEditionId: number;
  eventSession: IEventSession;
  sessionTypes = SessionType;
  sessionValues = SessionType;
  durationTypes = DurationType;
  durationValues = DurationType;

  timeZone: any;

  editForm = this.fb.group({
    id: [],
    eventEdition: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    shortname: [null, [Validators.required, Validators.maxLength(10)]],
    sessionStartTime: [null, [Validators.required]],
    duration: [null, [Validators.required]],
    durationType: [null, [Validators.required]],
    additionalLap: [],
    sessionType: [null, [Validators.required]],
    maxDuration: []
  });

  constructor(
    public dialogRef: MatDialogRef<EventSessionUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected eventSessionService: EventSessionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.eventEditionId = data.eventEditionId;
    this.eventSession = data.eventSession;

    if (this.eventSession.eventEdition.event.rally) {
      this.timeZone = this.eventSession.eventEdition.locationTimeZone;
    } else {
      this.timeZone = this.eventSession.eventEdition.trackLayout.racetrack.timeZone;
    }
  }

  ngOnInit() {
    this.isSaving = false;

    this.updateForm(this.eventSession);
  }

  durationKeys(): Array<string> {
    const keys = Object.keys(this.durationTypes);
    return keys.slice(keys.length / 2);
  }

  sessionKeys(): Array<string> {
    const keys = Object.keys(this.sessionTypes);
    return keys.slice(keys.length / 2);
  }

  updateForm(eventSession: IEventSession) {
    this.editForm.patchValue({
      id: eventSession.id,
      name: eventSession.name,
      shortname: eventSession.shortname,
      sessionStartTime: new Date(moment(eventSession.sessionStartTime).format('YYYY-MM-DDTHH:mm:ss')),
      duration: eventSession.duration,
      durationType: eventSession.durationType,
      additionalLap: eventSession.additionalLap,
      sessionType: eventSession.sessionType,
      maxDuration: eventSession.maxDuration
    });
    this.isRaceAndLaps = eventSession.sessionType >= 2 && eventSession.durationType === 5;
    if (this.eventSession.eventEdition.event.rally) {
      this.editForm.get('durationType').disable();
      this.editForm.get('durationType').setValue(this.durationTypes.kilometers);
      this.editForm.get('sessionType').setValue(this.sessionTypes.stage);
    }
  }

  previousState() {
    window.history.back();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save() {
    this.isSaving = true;
    const eventSession = this.createFromForm();
    if (eventSession.id !== undefined) {
      this.subscribeToSaveResponse(this.eventSessionService.update(eventSession));
    } else {
      this.subscribeToSaveResponse(this.eventSessionService.create(eventSession));
    }
  }

  public onChangeType(event) {
    const selectedType = parseInt(event.value, 10);
    this.isRaceAndLaps = selectedType >= 2 && this.editForm.get(['durationType']).value === 5;
  }

  private createFromForm(): IEventSession {
    return {
      ...this.eventSession,
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      shortname: this.editForm.get(['shortname']).value,
      sessionStartTime:
        this.editForm.get(['sessionStartTime']).value != null
          ? moment(this.editForm.get(['sessionStartTime']).value).tz(this.timeZone, true)
          : undefined,
      duration: this.editForm.get(['duration']).value,
      durationType: this.editForm.get(['durationType']).value,
      additionalLap: this.editForm.get(['additionalLap']).value,
      sessionType: this.editForm.get(['sessionType']).value,
      maxDuration: this.editForm.get(['maxDuration']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventSession>>) {
    result.subscribe(session => this.onSaveSuccess(session.body), () => this.onSaveError());
  }

  protected onSaveSuccess(session: IEventSession) {
    this.isSaving = false;
    this.dialogRef.close(session.id);
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
