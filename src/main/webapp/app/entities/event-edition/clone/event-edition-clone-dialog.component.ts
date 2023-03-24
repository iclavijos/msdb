import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormControl, ValidationErrors, FormArray } from '@angular/forms';

import { IEventEdition } from '../event-edition.model';
import { EventEditionService } from '../service/event-edition.service';

@Component({
  templateUrl: './event-edition-clone-dialog.component.html'
})
export class EventEditionCloneDialogComponent {
  eventEdition!: IEventEdition;
  isSaving = false;

  public cloneForm: UntypedFormGroup;

  constructor(
    private _fb: UntypedFormBuilder,
    private eventEditionService: EventEditionService,
    private activeModal: NgbActiveModal
  ) {
    this.cloneForm = this._fb.group({
      period: [null, [Validators.required, Validators.maxLength(20)]]
    });
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  clone(): void {
    this.isSaving = true;
    this.eventEditionService
      .clone(this.eventEdition.id!, this.cloneForm.get('period')!.value)
      .subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.activeModal.close('ok');
  }

  private onSaveError(): void {
    this.isSaving = false;
  }
}
