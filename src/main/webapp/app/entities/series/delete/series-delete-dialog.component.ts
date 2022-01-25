import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISeries } from '../series.model';
import { SeriesService } from '../service/series.service';

@Component({
  templateUrl: './series-delete-dialog.component.html',
})
export class SeriesDeleteDialogComponent {
  series?: ISeries;

  constructor(protected seriesService: SeriesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.seriesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
