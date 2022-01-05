import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEventSession, EventSession } from '../event-session.model';
import { EventSessionService } from '../service/event-session.service';

@Component({
  selector: 'jhi-event-session-update',
  templateUrl: './event-session-update.component.html',
})
export class EventSessionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    shortname: [null, [Validators.required, Validators.maxLength(10)]],
    sessionStartTime: [null, [Validators.required]],
    duration: [null, [Validators.required]],
  });

  constructor(protected eventSessionService: EventSessionService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventSession }) => {
      if (eventSession.id === undefined) {
        const today = dayjs().startOf('day');
        eventSession.sessionStartTime = today;
      }

      this.updateForm(eventSession);
    });
  }

  previousState(): void {
    window.history.back();
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventSession>>): void {
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

  protected updateForm(eventSession: IEventSession): void {
    this.editForm.patchValue({
      id: eventSession.id,
      name: eventSession.name,
      shortname: eventSession.shortname,
      sessionStartTime: eventSession.sessionStartTime ? eventSession.sessionStartTime.format(DATE_TIME_FORMAT) : null,
      duration: eventSession.duration,
    });
  }

  protected createFromForm(): IEventSession {
    return {
      ...new EventSession(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      shortname: this.editForm.get(['shortname'])!.value,
      sessionStartTime: this.editForm.get(['sessionStartTime'])!.value
        ? dayjs(this.editForm.get(['sessionStartTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      duration: this.editForm.get(['duration'])!.value,
    };
  }
}
