import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventEntry } from '../event-entry.model';
import { EventEntryService } from '../service/event-entry.service';

@Component({
  templateUrl: './event-entry-delete-dialog.component.html',
})
export class EventEntryDeleteDialogComponent {
  eventEntry?: IEventEntry;

  constructor(protected eventEntryService: EventEntryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventEntryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
