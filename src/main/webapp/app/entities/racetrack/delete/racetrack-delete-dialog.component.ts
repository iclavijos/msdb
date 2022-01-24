import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRacetrack } from '../racetrack.model';
import { RacetrackService } from '../service/racetrack.service';

@Component({
  templateUrl: './racetrack-delete-dialog.component.html',
})
export class RacetrackDeleteDialogComponent {
  racetrack?: IRacetrack;

  constructor(protected racetrackService: RacetrackService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.racetrackService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
