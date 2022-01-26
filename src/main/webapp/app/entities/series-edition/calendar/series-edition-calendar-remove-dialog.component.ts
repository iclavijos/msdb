import { Component, Inject } from '@angular/core';

import { SeriesEditionService } from './series-edition.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './series-edition-calendar-remove-dialog.component.html'
})
export class SeriesEditionCalendarRemoveDialogComponent {
  eventId: number;
  eventName: string;
  seriesId: number;

  constructor(
    private seriesEditionService: SeriesEditionService,
    public dialogRef: MatDialogRef<SeriesEditionCalendarRemoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.eventId = data.eventEditionId;
    this.seriesId = data.seriesEditionId;
    this.eventName = data.eventName;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirmRemove(): void {
    this.seriesEditionService.removeEventFromSeries(this.seriesId, this.eventId).subscribe(() => this.dialogRef.close('ok'));
  }
}
