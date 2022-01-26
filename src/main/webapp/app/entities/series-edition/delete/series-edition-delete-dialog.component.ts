import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISeriesEdition } from '../series-edition.model';
import { SeriesEditionService } from '../service/series-edition.service';

@Component({
  templateUrl: './series-edition-delete-dialog.component.html',
})
export class SeriesEditionDeleteDialogComponent {
  seriesEdition?: ISeriesEdition;

  constructor(protected seriesEditionService: SeriesEditionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.seriesEditionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
