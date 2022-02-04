import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IEventEdition } from '../event-edition.model';
import { EventEditionService } from '../service/event-edition.service';

import { DateTime } from 'luxon';

@Component({
  templateUrl: './event-edition-reschedule-dialog.component.html'
})
export class EventEditionRescheduleDialogComponent {
  eventEdition?: IEventEdition;
  startDate = DateTime.now();
  isSaving = false;
  public rescheduleForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private eventEditionService: EventEditionService,
    private activeModal: NgbActiveModal
  ) {
    this.rescheduleForm = this._fb.group({
      newDate: [null, [Validators.required]],
    });
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmReschedule(): void {
    this.isSaving = true;
    const timeZone =
      !this.eventEdition!.isRally() && !this.eventEdition!.isRaid()
        ? this.eventEdition!.trackLayout!.racetrack!.timeZone
        : this.eventEdition!.isRally()
          ? this.eventEdition!.locationTimeZone
          : this.eventEdition!.sessions?.[0].locationTimeZone;
    this.eventEditionService
        .rescheduleEvent(this.eventEdition!.id!, DateTime.fromJSDate(this.rescheduleForm.get('newDate')!.value, { zone: timeZone}))
        .subscribe(() => this.activeModal.dismiss());

    this.isSaving = false;
  }
}
