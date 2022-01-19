import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFuelProvider } from '../fuel-provider.model';
import { FuelProviderService } from '../service/fuel-provider.service';

@Component({
  templateUrl: './fuel-provider-delete-dialog.component.html',
})
export class FuelProviderDeleteDialogComponent {
  fuelProvider?: IFuelProvider;

  constructor(protected fuelProviderService: FuelProviderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fuelProviderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
