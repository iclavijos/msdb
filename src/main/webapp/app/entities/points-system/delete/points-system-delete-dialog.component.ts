import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPointsSystem } from '../points-system.model';
import { PointsSystemService } from '../service/points-system.service';

@Component({
  templateUrl: './points-system-delete-dialog.component.html',
})
export class PointsSystemDeleteDialogComponent {
  pointsSystem?: IPointsSystem;

  constructor(protected pointsSystemService: PointsSystemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pointsSystemService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
