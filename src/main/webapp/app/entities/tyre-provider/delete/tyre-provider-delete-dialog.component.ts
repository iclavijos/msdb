import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITyreProvider } from '../tyre-provider.model';
import { TyreProviderService } from '../service/tyre-provider.service';

@Component({
  templateUrl: './tyre-provider-delete-dialog.component.html',
})
export class TyreProviderDeleteDialogComponent {
  tyreProvider!: ITyreProvider;

  constructor(protected tyreProviderService: TyreProviderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tyreProviderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
