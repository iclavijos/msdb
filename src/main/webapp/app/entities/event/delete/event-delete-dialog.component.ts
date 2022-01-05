import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEvent } from '../event.model';
import { EventService } from '../service/event.service';

@Component({
  templateUrl: './event-delete-dialog.component.html',
})
export class EventDeleteDialogComponent {
  event?: IEvent;

  constructor(protected eventService: EventService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
