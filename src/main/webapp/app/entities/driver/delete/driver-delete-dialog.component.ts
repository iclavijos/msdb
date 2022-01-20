import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDriver } from '../driver.model';
import { DriverService } from '../service/driver.service';

@Component({
  templateUrl: './driver-delete-dialog.component.html',
})
export class DriverDeleteDialogComponent {
  driver?: IDriver;

  constructor(protected driverService: DriverService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.driverService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
