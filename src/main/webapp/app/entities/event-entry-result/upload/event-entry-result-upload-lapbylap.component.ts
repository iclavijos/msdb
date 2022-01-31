import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from 'app/core/util/alert.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

import { Imports, ImportsService } from 'app/shared/services/imports.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './event-entry-result-upload-lapbylap.component.html'
})
export class EventEntryResultUploadLapByLapComponent {
  editForm: FormGroup;
  imports: Imports;
  isSaving = false;

  constructor(
    private alertService: AlertService,
    private dataUtils: DataUtils,
    private importsService: ImportsService,
    private eventManager: EventManager,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventEntryResultUploadLapByLapComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.imports = new Imports();
    this.imports.importType = 'LAP_BY_LAP';
    this.imports.associatedId = data.eventSession.id;
    this.editForm = this.fb.group({
      file: []
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('motorsportsDatabaseApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  upload(): void {
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
