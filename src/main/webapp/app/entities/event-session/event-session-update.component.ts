import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IEventSession, EventSession } from 'app/shared/model/event-session.model';
import { EventSessionService } from './event-session.service';

@Component({
  selector: 'jhi-event-session-update',
  templateUrl: './event-session-update.component.html'
})
export class EventSessionUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    shortname: [null, [Validators.required, Validators.maxLength(10)]],
    sessionStartTime: [null, [Validators.required]],
    duration: [null, [Validators.required]]
  });

  constructor(protected eventSessionService: EventSessionService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ eventSession }) => {
      this.updateForm(eventSession);
    });
  }

  updateForm(eventSession: IEventSession) {
    this.editForm.patchValue({
      id: eventSession.id,
      name: eventSession.name,
      shortname: eventSession.shortname,
      sessionStartTime: eventSession.sessionStartTime != null ? eventSession.sessionStartTime.format(DATE_TIME_FORMAT) : null,
      duration: eventSession.duration
    });
  }

  previousState() {
    window.history.back();
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

  private createFromForm(): IEventSession {
    return {
      ...new EventSession(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      shortname: this.editForm.get(['shortname']).value,
      sessionStartTime:
        this.editForm.get(['sessionStartTime']).value != null
          ? moment(this.editForm.get(['sessionStartTime']).value, DATE_TIME_FORMAT)
          : undefined,
      duration: this.editForm.get(['duration']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventSession>>) {
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
