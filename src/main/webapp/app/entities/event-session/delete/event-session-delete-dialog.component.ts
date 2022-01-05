import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventSession } from '../event-session.model';
import { EventSessionService } from '../service/event-session.service';

@Component({
  templateUrl: './event-session-delete-dialog.component.html',
})
export class EventSessionDeleteDialogComponent {
  eventSession?: IEventSession;

  constructor(protected eventSessionService: EventSessionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventSessionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
