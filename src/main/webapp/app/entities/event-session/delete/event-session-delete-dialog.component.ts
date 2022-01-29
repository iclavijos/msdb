import { Component, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IEventSession } from '../event-session.model';
import { EventSessionService } from '../service/event-session.service';

@Component({
  templateUrl: './event-session-delete-dialog.component.html',
})
export class EventSessionDeleteDialogComponent {
  eventSession?: IEventSession;

  constructor(
    protected eventSessionService: EventSessionService,
    protected activeModal: NgbActiveModal,
    protected dialogRef: MatDialogRef<EventSessionDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: any) {
    this.eventSession = data.eventSession;
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventSessionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
