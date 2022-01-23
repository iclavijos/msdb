import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEngine } from '../engine.model';
import { EngineService } from '../service/engine.service';

@Component({
  templateUrl: './engine-delete-dialog.component.html',
})
export class EngineDeleteDialogComponent {
  engine?: IEngine;

  constructor(protected engineService: EngineService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.engineService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
