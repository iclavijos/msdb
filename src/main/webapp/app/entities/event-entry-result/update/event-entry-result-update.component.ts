import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEventEntryResult, EventEntryResult } from '../event-entry-result.model';
import { EventEntryResultService } from '../service/event-entry-result.service';

@Component({
  selector: 'jhi-event-entry-result-update',
  templateUrl: './event-entry-result-update.component.html',
})
export class EventEntryResultUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    finalPosition: [],
    totalTime: [],
    bestLapTime: [],
    lapsCompleted: [],
    retired: [],
  });

  constructor(
    protected eventEntryResultService: EventEntryResultService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventEntryResult }) => {
      this.updateForm(eventEntryResult);
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
      finalPosition: eventEntryResult.finalPosition,
      totalTime: eventEntryResult.totalTime,
      bestLapTime: eventEntryResult.bestLapTime,
      lapsCompleted: eventEntryResult.lapsCompleted,
      retired: eventEntryResult.retired,
    });
  }

  protected createFromForm(): IEventEntryResult {
    return {
      ...new EventEntryResult(),
      id: this.editForm.get(['id'])!.value,
      finalPosition: this.editForm.get(['finalPosition'])!.value,
      totalTime: this.editForm.get(['totalTime'])!.value,
      bestLapTime: this.editForm.get(['bestLapTime'])!.value,
      lapsCompleted: this.editForm.get(['lapsCompleted'])!.value,
      retired: this.editForm.get(['retired'])!.value,
    };
  }
}
