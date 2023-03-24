import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEventEdition } from 'app/entities/event-edition/event-edition.model';
import { IEventEntry } from 'app/entities/event-entry/event-entry.model';
import { IEventEntryResult } from '../event-entry-result.model';
import { EventEntryResultService } from '../service/event-entry-result.service';

import { TimeMaskPipe } from 'app/shared/mask/time-mask.pipe';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

@Component({
  selector: 'jhi-event-entry-result-update',
  templateUrl: './event-entry-result-update.component.html',
})
export class EventEntryResultUpdateComponent implements OnInit {
  isSaving = false;
  eventEdition!: IEventEdition;
  eventEntryResult!: IEventEntryResult;
  entries: IEventEntry[] = [];
  sessionTypes = SessionType;

  positions: number[] = [];

  editForm = this.fb.group({
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
    pitlaneStart: [],
    invalidFastlap: []
  });

  constructor(
    protected eventEntryResultService: EventEntryResultService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder,
    protected timeMaskPipe: TimeMaskPipe
  ) {
//     this.eventEdition = data.eventEdition;
//     this.eventEntryResult = data.eventEntryResult;
//     this.eventEntryResult.session = data.eventSession;
//     this.entries = data.eventEntries;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventEntryResult }) => {
      this.updateForm(eventEntryResult);

      this.positions = Array.from(Array(this.entries.length), (x, i) => i + 1);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventEntryResult = this.createFromForm();
    if (eventEntryResult.id !== undefined) {
      this.subscribeToSaveResponse(this.eventEntryResultService.update(eventEntryResult));
    } else {
      this.subscribeToSaveResponse(this.eventEntryResultService.create(eventEntryResult));
    }
  }

  updateUI(): void {
    this.eventEntryResult.retired = this.eventEntryResult.finalPosition! >= 900;
  }

  trackEntryById(option: IEventEntry, value: IEventEntry): boolean {
    return option.id === value.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventEntryResult>>): void {
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

  protected updateForm(eventEntryResult: IEventEntryResult): void {
    this.editForm.patchValue({
      id: eventEntryResult.id,
      startingPosition: eventEntryResult.startingPosition,
      finalPosition: eventEntryResult.finalPosition,
      totalTime: eventEntryResult.totalTime ? this.timeMaskPipe.transform(eventEntryResult.totalTime, true, true, true) : null,
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
      entry: eventEntryResult.entry,
      invalidFastlap: eventEntryResult.invalidFastlap
    });
  }

  protected createFromForm(): IEventEntryResult {
    return {
      ...this.eventEntryResult,
      id: this.editForm.get(['id'])!.value,
      startingPosition: this.editForm.get(['startingPosition'])!.value,
      entry: this.editForm.get(['entry'])!.value,
      finalPosition: this.editForm.get(['finalPosition'])!.value,
      totalTime: this.toMillis(this.editForm.get(['totalTime'])!.value),
      bestLapTime: this.toMillis(this.editForm.get(['bestLapTime'])!.value),
      lapsCompleted: this.editForm.get(['lapsCompleted'])!.value,
      retired: this.editForm.get(['retired'])!.value,
      differenceType: this.editForm.get(['differenceType'])!.value,
      difference:
        this.editForm.get(['differenceType'])!.value === '1'
          ? this.toMillis(this.editForm.get(['difference'])!.value)
          : this.editForm.get(['difference'])!.value,
      lapsLed: this.editForm.get(['lapsLed'])!.value,
      sharedWith: this.editForm.get(['sharedDrive'])!.value ? this.editForm.get(['sharedWith'])!.value : null,
      cause: this.editForm.get(['cause'])!.value,
      pitlaneStart: this.editForm.get(['pitlaneStart'])!.value,
      invalidFastlap: this.editForm.get(['invalidFastlap'])!.value
    };
  }

  private toMillis(laptime: string): number {
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
