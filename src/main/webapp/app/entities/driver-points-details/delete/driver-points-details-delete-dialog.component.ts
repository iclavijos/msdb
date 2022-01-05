import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDriverPointsDetails } from '../driver-points-details.model';
import { DriverPointsDetailsService } from '../service/driver-points-details.service';

@Component({
  templateUrl: './driver-points-details-delete-dialog.component.html',
})
export class DriverPointsDetailsDeleteDialogComponent {
  driverPointsDetails?: IDriverPointsDetails;

  constructor(protected driverPointsDetailsService: DriverPointsDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.driverPointsDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
