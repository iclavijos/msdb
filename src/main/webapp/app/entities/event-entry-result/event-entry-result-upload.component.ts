import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Imports, ImportsService } from '../../shared/services/imports.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './event-entry-result-upload.component.html'
})
export class EventEntryUploadResultsComponent implements OnInit {
  editForm: FormGroup;
  imports: Imports;
  isSaving: boolean;

  constructor(
    private alertService: JhiAlertService,
    private dataUtils: JhiDataUtils,
    private importsService: ImportsService,
    private eventManager: JhiEventManager,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventEntryUploadResultsComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.imports = new Imports();
    this.imports.importType = 'SESSION_RESULTS';
    this.imports.associatedId = data.eventSession.id;
    this.editForm = this.fb.group({
      file: []
    });
  }

  ngOnInit() {
    this.isSaving = false;
  }

  close() {
    this.dialogRef.close();
  }

  setFileData(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      this.dataUtils.toBase64(file, base64Data => {
        this.imports.csvContents = base64Data;
      });
    }
  }

  upload() {
    this.isSaving = true;

    this.importsService.importCSV(this.imports).subscribe(
      () => {
        this.isSaving = false;
        this.dialogRef.close('OK');
      },
      () => {
        this.isSaving = false;
        return;
      }
    );
  }
}
