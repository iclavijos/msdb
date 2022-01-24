import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRacetrackLayout } from '../racetrack-layout.model';
import { RacetrackLayoutService } from '../service/racetrack-layout.service';

@Component({
  templateUrl: './racetrack-layout-delete-dialog.component.html',
})
export class RacetrackLayoutDeleteDialogComponent {
  racetrackLayout?: IRacetrackLayout;

  constructor(protected racetrackLayoutService: RacetrackLayoutService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.racetrackLayoutService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
