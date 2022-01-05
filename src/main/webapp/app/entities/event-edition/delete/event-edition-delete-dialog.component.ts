import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventEdition } from '../event-edition.model';
import { EventEditionService } from '../service/event-edition.service';

@Component({
  templateUrl: './event-edition-delete-dialog.component.html',
})
export class EventEditionDeleteDialogComponent {
  eventEdition?: IEventEdition;

  constructor(protected eventEditionService: EventEditionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventEditionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
