import { Component, OnInit, Inject } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormGroup, FormControl, ValidationErrors, FormArray } from '@angular/forms';
import { JhiAlertService } from 'ng-jhipster';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ISeriesEdition } from '../../shared/model/series-edition.model';
import { SeriesEditionService } from './series-edition.service';

@Component({
  selector: 'jhi-series-edition-calendar-dialog',
  templateUrl: './series-edition-clone-dialog.component.html'
})
export class SeriesEditionCloneDialogComponent implements OnInit {
  seriesEdition: ISeriesEdition;
  isSaving: boolean;

  public editForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private jhiAlertService: JhiAlertService,
    private seriesEditionService: SeriesEditionService,
    private dialogRef: MatDialogRef<SeriesEditionCloneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.seriesEdition = data.seriesEdition;

    this.editForm = this._fb.group({
      period: [null, [Validators.required, Validators.maxLength(20)]]
    });
  }

  ngOnInit(): void {
    this.isSaving = false;
  }

  close(): void {
    this.dialogRef.close();
  }

  clone(): void {
    this.isSaving = true;
    this.seriesEditionService
      .clone(this.seriesEdition.id, this.editForm.get('period').value)
      .subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.dialogRef.close('ok');
  }

  private onSaveError(): void {
    this.isSaving = false;
  }
}
