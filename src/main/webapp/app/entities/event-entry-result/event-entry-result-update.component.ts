import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IEventEntryResult, EventEntryResult } from 'app/shared/model/event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';

@Component({
  selector: 'jhi-event-entry-result-update',
  templateUrl: './event-entry-result-update.component.html'
})
export class EventEntryResultUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    finalPosition: [],
    totalTime: [],
    bestLapTime: [],
    lapsCompleted: [],
    retired: []
  });

  constructor(
    protected eventEntryResultService: EventEntryResultService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ eventEntryResult }) => {
      this.updateForm(eventEntryResult);
    });
  }

  updateForm(eventEntryResult: IEventEntryResult) {
    this.editForm.patchValue({
      id: eventEntryResult.id,
      finalPosition: eventEntryResult.finalPosition,
      totalTime: eventEntryResult.totalTime,
      bestLapTime: eventEntryResult.bestLapTime,
      lapsCompleted: eventEntryResult.lapsCompleted,
      retired: eventEntryResult.retired
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const eventEntryResult = this.createFromForm();
    if (eventEntryResult.id !== undefined) {
      this.subscribeToSaveResponse(this.eventEntryResultService.update(eventEntryResult));
    } else {
      this.subscribeToSaveResponse(this.eventEntryResultService.create(eventEntryResult));
    }
  }

  private createFromForm(): IEventEntryResult {
    return {
      ...new EventEntryResult(),
      id: this.editForm.get(['id']).value,
      finalPosition: this.editForm.get(['finalPosition']).value,
      totalTime: this.editForm.get(['totalTime']).value,
      bestLapTime: this.editForm.get(['bestLapTime']).value,
      lapsCompleted: this.editForm.get(['lapsCompleted']).value,
      retired: this.editForm.get(['retired']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventEntryResult>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
