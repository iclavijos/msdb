import { Component, Inject } from '@angular/core';

import { IEventEntryResult } from 'app/shared/model/event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './event-entry-result-delete-dialog.component.html'
})
export class EventEntryResultDeleteDialogComponent {
  result: IEventEntryResult;

  constructor(
    private eventEntryResultService: EventEntryResultService,
    public dialogRef: MatDialogRef<EventEntryResultDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.result = data.eventEntryResult;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.eventEntryResultService.delete(this.result.id).subscribe(() => this.dialogRef.close(this.result.id));
  }
}
