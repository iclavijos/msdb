import { Component, Inject } from '@angular/core';

import { IEventSession } from 'app/shared/model/event-session.model';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-event-session-delete-dialog',
  templateUrl: './event-session-delete-dialog.component.html'
})
export class EventSessionDeleteDialogComponent {
  eventSession: IEventSession;

  constructor(public dialogRef: MatDialogRef<EventSessionDeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.eventSession = data.eventSession;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dialogRef.close(this.eventSession.id);
  }
}
