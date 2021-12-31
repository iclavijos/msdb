import { Component, OnInit, Inject } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormGroup, FormControl, ValidationErrors, FormArray } from '@angular/forms';
import { JhiAlertService } from 'ng-jhipster';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IEventEdition } from '../../shared/model/event-edition.model';
import { EventEditionService } from './event-edition.service';

@Component({
  selector: 'jhi-event-edition-clone-dialog',
  templateUrl: './event-edition-clone-dialog.component.html'
})
export class EventEditionCloneDialogComponent implements OnInit {
  eventEdition: IEventEdition;
  isSaving: boolean;

  public editForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private jhiAlertService: JhiAlertService,
    private eventEditionService: EventEditionService,
    private dialogRef: MatDialogRef<EventEditionCloneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.eventEdition = data.eventEdition;

    this.editForm = this._fb.group({
      period: [null, [Validators.required, Validators.maxLength(20)]]
    });
  }

  ngOnInit() {
    this.isSaving = false;
  }

  close() {
    this.dialogRef.close();
  }

  clone() {
    this.isSaving = true;
    this.eventEditionService
      .clone(this.eventEdition.id, this.editForm.get('period').value)
      .subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  private onSaveSuccess() {
    this.isSaving = false;
    this.dialogRef.close('ok');
  }

  private onSaveError() {
    this.isSaving = false;
  }
}
