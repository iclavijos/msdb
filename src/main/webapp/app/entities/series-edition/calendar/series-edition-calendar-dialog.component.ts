import { Component, OnInit, Inject } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormGroup, FormControl, ValidationErrors, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap, debounceTime, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';

import { IEventEdition } from 'app/entities/event-edition/event-edition.model';
import { EventEditionService } from 'app/entities/event-edition/service/event-edition.service';
import { EventSessionService } from 'app/entities/event-session/service/event-session.service';
import { IEventSession } from 'app/entities/event-session/event-session.model';
import { ISeriesEdition } from '../series-edition.model';
import { SeriesEditionService } from '../service/series-edition.service';

import { SessionType } from 'app/shared/enumerations/sessionType.enum';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as moment from 'moment';

@Component({
  templateUrl: './series-edition-calendar-dialog.component.html'
})
export class SeriesEditionCalendarDialogComponent implements OnInit {
  seriesEdition: ISeriesEdition;
  eventEdition: IEventEdition;
  isSaving: boolean;
  searching = false;
  searchFailed = false;
  eventOptions: Observable<IEventEdition[]>;
  public editForm: FormGroup;
  private sessionType = SessionType;

  constructor(
    private _fb: FormBuilder,
    private seriesEditionService: SeriesEditionService,
    private eventEditionService: EventEditionService,
    private eventSessionService: EventSessionService,
    private alertService: JhiAlertService,
    private dialogRef: MatDialogRef<SeriesEditionCalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.seriesEdition = data.seriesEdition;
    this.eventEdition = data.eventEdition;

    this.editForm = this._fb.group({
      event: new FormControl(),
      races: this._fb.array([])
    });
  }

  ngOnInit(): void {
    this.isSaving = false;

    if (this.eventEdition) {
      this.editForm.patchValue({
        event: this.eventEdition
      });
    }

    this.displayFnEvents = this.displayFnEvents.bind(this);

    this.eventOptions = this.editForm.get('event').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.eventEditionService.search({
            query: value
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );

    if (this.eventEdition) {
      this.updateUI();
    }
  }

  initSession(session: IEventSession): void {
    let pSystemAss = '';
    let psMult = 1;

    if (session.pointsSystemsSession !== undefined && session.pointsSystemsSession.length > 0) {
      const pSystem = session.pointsSystemsSession.filter(pss => pss.id.seriesEditionId === this.seriesEdition.id);
      if (pSystem.length > 0) {
        pSystemAss = pSystem[0].pointsSystem.id;
        psMult = pSystem[0].psMultiplier;
      }
    }

    return this._fb.group({
      raceId: session.id,
      raceName: session.name,
      seriesId: this.seriesEdition.id,
      pSystemAssigned: pSystemAss,
      psMultiplier: psMult.toString()
    });
  }

  addRaces(races: IEventSession[]): void {
    const control = this.editForm.get('races') as FormArray;
    for (const race of races) {
      control.push(this.initSession(race));
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.isSaving = true;
    this.seriesEditionService
      .addEventToSeries(this.seriesEdition.id, this.eventEdition.id, this.editForm.value.races)
      .subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  setEvent(event: IEventEdition): void {
    this.eventEdition = event;
    this.updateUI();
  }

  displayFnEvents(event?: any): string | undefined {
    return event ? event.longEventName as string: undefined;
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.dialogRef.close('ok');
  }

  private onSaveError(): void {
    this.isSaving = false;
  }

  private updateUI(): void {
    this.eventSessionService.findSessions(this.eventEdition.id, moment.tz.guess(true)).subscribe(eventSessions => {
      const sessions: IEventSession[] = eventSessions.body.filter(session => session.sessionType !== this.sessionType['practice']);
      this.eventEdition.sessions = sessions;
      this.addRaces(sessions);
    });
  }
}
