import { Component, OnInit, Inject } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IEventEntryResult } from 'app/shared/model/event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';
import { IEventEdition } from 'app/shared/model/event-edition.model';
import { IEventEntry } from 'app/shared/model/event-entry.model';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TimeMaskPipe } from 'app/shared/mask/time-mask.pipe';

@Component({
  templateUrl: './event-entry-result-update.component.html'
})
export class EventEntryResultUpdateComponent implements OnInit {
  isSaving: boolean;
  editForm: FormGroup;
  eventEdition: IEventEdition;
  eventEntryResult: IEventEntryResult;
  entries: IEventEntry[];
  sessionTypes = SessionType;

  positions: number[];

  constructor(
    protected eventEntryResultService: EventEntryResultService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventEntryResultUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private timeMaskPipe: TimeMaskPipe
  ) {
    this.eventEdition = data.eventEdition;
    this.eventEntryResult = data.eventEntryResult;
    this.eventEntryResult.session = data.eventSession;
    this.entries = data.eventEntries;
    this.editForm = fb.group({
      id: [],
      startingPosition: [],
      finalPosition: [null, [Validators.required]],
      entry: [null, [Validators.required]],
      totalTime: [],
      bestLapTime: [],
      lapsCompleted: [],
      retired: [],
      differenceType: [],
      difference: [],
      lapsLed: [],
      sharedDrive: [],
      sharedWith: [],
      cause: [null, Validators.maxLength(100)],
      pitlaneStart: []
    });
  }

  ngOnInit() {
    this.isSaving = false;
    this.updateForm(this.eventEntryResult);

    this.positions = Array.from(Array(this.entries.length), (x, i) => i + 1);
  }

  updateForm(eventEntryResult: IEventEntryResult) {
    this.editForm.patchValue({
      id: eventEntryResult.id,
      startingPosition: eventEntryResult.startingPosition,
      finalPosition: eventEntryResult.finalPosition,
      totalTime: eventEntryResult.totalTime ? this.timeMaskPipe.transform(eventEntryResult.totalTime, true, true) : null,
      bestLapTime: eventEntryResult.bestLapTime ? this.timeMaskPipe.transform(eventEntryResult.bestLapTime) : null,
      lapsCompleted: eventEntryResult.lapsCompleted,
      retired: eventEntryResult.retired,
      differenceType: eventEntryResult.differenceType ? eventEntryResult.differenceType.toString() : null,
      difference:
        eventEntryResult.differenceType === 1 ? this.timeMaskPipe.transform(eventEntryResult.difference) : eventEntryResult.difference,
      lapsLed: eventEntryResult.lapsLed,
      sharedDrive: eventEntryResult.sharedWith ? true : false,
      sharedWith: eventEntryResult.sharedWith,
      cause: eventEntryResult.cause,
      pitlaneStart: eventEntryResult.pitlaneStart,
      entry: eventEntryResult.entry
    });
  }

  private createFromForm(): IEventEntryResult {
    return {
      ...this.eventEntryResult,
      id: this.editForm.get(['id']).value,
      startingPosition: this.editForm.get(['startingPosition']).value,
      entry: this.editForm.get(['entry']).value,
      finalPosition: this.editForm.get(['finalPosition']).value,
      totalTime: this.toMillis(this.editForm.get(['totalTime']).value),
      bestLapTime: this.toMillis(this.editForm.get(['bestLapTime']).value),
      lapsCompleted: this.editForm.get(['lapsCompleted']).value,
      retired: this.editForm.get(['retired']).value,
      differenceType: this.editForm.get(['differenceType']).value,
      difference:
        this.editForm.get(['differenceType']).value === 1
          ? this.toMillis(this.editForm.get(['difference']).value)
          : this.editForm.get(['difference']).value,
      lapsLed: this.editForm.get(['lapsLed']).value,
      sharedWith: this.editForm.get(['sharedDrive']).value ? this.editForm.get(['sharedWith']).value : null,
      cause: this.editForm.get(['cause']).value,
      pitlaneStart: this.editForm.get(['pitlaneStart']).value
    };
  }

  save() {
    this.isSaving = true;
    const eventEntryResult = this.createFromForm();
    if (eventEntryResult.id !== undefined) {
      this.subscribeToSaveResponse(this.eventEntryResultService.update(eventEntryResult, eventEntryResult.session.id));
    } else {
      return this.subscribeToSaveResponse(this.eventEntryResultService.create(eventEntryResult, eventEntryResult.session.id));
    }
  }

  close() {
    this.dialogRef.close();
  }

  updateUI() {
    this.eventEntryResult.retired = this.eventEntryResult.finalPosition >= 900;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventEntryResult>>) {
    return result.subscribe(
      res => {
        this.isSaving = false;
        this.dialogRef.close(res);
      },
      () => {
        return;
      }
    );
  }

  trackEntryById(option: IEventEntry, value: IEventEntry): boolean {
    if (!value) return false;
    return option.id === value.id;
  }

  private toMillis(laptime: string) {
    if (!laptime) return;

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let tenthousands: string;
    let last = 0;

    if (laptime.includes('h')) {
      last = laptime.indexOf('h');
      hours = parseInt(laptime.substring(0, last), 10);
    }
    // Minutes
    if (last !== 0) {
      last++;
    }
    if (laptime.includes("'")) {
      minutes = parseInt(laptime.substring(last, laptime.indexOf("'")), 10);
      last = laptime.indexOf("'");
    }

    // Seconds
    if (laptime.includes('.')) {
      if (last !== 0) {
        last++;
      }
      seconds = parseInt(laptime.substring(last, laptime.indexOf('.')), 10);
      last = laptime.indexOf('.');

      // Millis
      tenthousands = String(laptime.substring(last + 1) + '0000').slice(0, 4);
    } else {
      seconds = parseInt(laptime.substring(last + 1), 10);
      tenthousands = '0000';
    }

    return parseInt((hours * 3600 + minutes * 60 + seconds).toString() + tenthousands, 10);
  }
}

/*

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { EventEntry, EventEntryService } from '../event-entry';
import { EventEntryResult } from './event-entry-result.model';
import { EventEntryResultPopupService } from './event-entry-result-popup.service';
import { EventEntryResultService } from './event-entry-result.service';
import { EventSessionService } from '../event-session';

import { SessionType } from '../../shared/enumerations/sessionType.enum';

@Component({
    selector: 'jhi-event-entry-result-dialog',
    templateUrl: './event-entry-result-dialog.component.html'
})
export class EventEntryResultDialogComponent implements OnInit {

    eventEntryResult: EventEntryResult;
    authorities: any[];
    isSaving: boolean;
    entries: EventEntry[];
    bestLapTime: string;
    totalTime: string;
    timeDifference: string;
    sessionType = SessionType;
    private eventEditionId;
    positions: number[];
    multidriver = false;
    private sharedDrive = false;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventEntryService: EventEntryService,
        private eventEntryResultService: EventEntryResultService,
        private eventSessionService: EventSessionService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.eventSessionService.find(this.eventEntryResult.session.id).subscribe(session => {
            this.eventEntryResult.session = session;
            this.multidriver = session.eventEdition.multidriver;
            this.eventEntryService.findEntries(this.eventEntryResult.session.eventEdition.id).subscribe(entries => {
                this.entries = entries.json();
                this.positions = Array.from(Array(this.entries.length),(x,i)=>i+1);
            });
        });
        if (this.eventEntryResult !== null && this.eventEntryResult.sharedDriveWith) {
        	this.sharedDrive = this.eventEntryResult.sharedDriveWith.id !== undefined;
        }
        this.isSaving = false;
        this.authorities = ['ROLE_EDITOR', 'ROLE_ADMIN'];
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (!this.sharedDrive) {
          this.eventEntryResult.sharedDriveWith = null;
        }
        if (this.bestLapTime) {
            this.eventEntryResult.bestLapTime = this.toMillis(this.bestLapTime);
        }
        if (this.totalTime) {
            this.eventEntryResult.totalTime = this.toMillis(this.totalTime);
        }
        console.log('Difference type: ' + this.eventEntryResult.differenceType);
        if (this.eventEntryResult.differenceType == 1) {
        	console.log('Difference: ' + this.timeDifference);
            if (this.timeDifference !== undefined) {
                this.eventEntryResult.difference = this.toMillis(this.timeDifference);
            }
            console.log('Converted difference: ' + this.eventEntryResult.difference);
        }
        if (this.eventEntryResult.id !== undefined) {
            this.subscribeToSaveResponse(
                this.eventEntryResultService.update(this.eventEntryResult));
        } else {
            this.subscribeToSaveResponse(
                this.eventEntryResultService.create(this.eventEntryResult));
        }
    }

    private subscribeToSaveResponse(result: Observable<EventEntryResult>) {
        result.subscribe((res: EventEntryResult) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    trackEntryById(index: number, item: EventEntry) {
        return item.id;
    }

    private onSaveSuccess(result: EventEntryResult) {
        this.eventManager.broadcast({ name: 'eventEntryResultListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
*/
