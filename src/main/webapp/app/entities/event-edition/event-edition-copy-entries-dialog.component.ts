import { Component, OnInit, Inject } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators, FormGroup, FormControl, ValidationErrors, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap, debounceTime, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';

import { IEventEdition } from '../../shared/model/event-edition.model';
import { EventEditionService } from './event-edition.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './event-edition-copy-entries-dialog.component.html'
})
export class EventEditionCopyEntriesDialogComponent implements OnInit {
  targetEvent: IEventEdition;
  sourceEvent: IEventEdition;
  eventOptions: Observable<IEventEdition[]>;
  isSaving: boolean;
  public editForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private alertService: JhiAlertService,
    private eventEditionService: EventEditionService,
    private dialogRef: MatDialogRef<EventEditionCopyEntriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.targetEvent = data.targetEvent;
    this.editForm = this._fb.group({
      sourceEvent: new FormControl()
    });
  }

  ngOnInit() {
    this.isSaving = false;

    this.displayFnEvents = this.displayFnEvents.bind(this);

    this.eventOptions = this.editForm.get('sourceEvent').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.eventEditionService.search({
            query: value
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );
  }

  displayFnEvents(event?: any): string | undefined {
    return event ? event.longEventName : undefined;
  }

  setEvent(event: IEventEdition) {
    this.sourceEvent = event;
  }

  close() {
    this.dialogRef.close('ok');
  }

  confirmCopy() {
    this.isSaving = true;
    this.eventEditionService.copyEntries(this.sourceEvent.id, this.targetEvent.id).subscribe(() => this.dialogRef.close('ok'));
    this.isSaving = false;
  }
}
