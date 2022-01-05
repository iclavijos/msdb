import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChassis } from '../chassis.model';
import { ChassisService } from '../service/chassis.service';

@Component({
  templateUrl: './chassis-delete-dialog.component.html',
})
export class ChassisDeleteDialogComponent {
  chassis?: IChassis;

  constructor(protected chassisService: ChassisService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chassisService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
