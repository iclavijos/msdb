import { Component, Inject } from '@angular/core';

import { IEventEntry } from 'app/shared/model/event-entry.model';
import { EventEntryService } from './event-entry.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './event-entry-delete-dialog.component.html'
})
export class EventEntryDeleteDialogComponent {
  entry: IEventEntry;

  constructor(
    private eventEntryService: EventEntryService,
    public dialogRef: MatDialogRef<EventEntryDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.entry = data.eventEntry;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.eventEntryService.delete(this.entry.id).subscribe(() => this.dialogRef.close(this.entry.id));
  }
}
