import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventEntryResult } from '../event-entry-result.model';
import { EventEntryResultService } from '../service/event-entry-result.service';

@Component({
  templateUrl: './event-entry-result-delete-dialog.component.html',
})
export class EventEntryResultDeleteDialogComponent {
  eventEntryResult?: IEventEntryResult;

  constructor(protected eventEntryResultService: EventEntryResultService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventEntryResultService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
