import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormControl, ValidationErrors, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap, debounceTime, map } from 'rxjs/operators';

import { IEventEdition } from '../event-edition.model';
import { EventEditionService } from '../service/event-edition.service';

@Component({
  templateUrl: './event-edition-copy-entries-dialog.component.html'
})
export class EventEditionCopyEntriesDialogComponent implements OnInit {
  targetEvent!: IEventEdition;
  sourceEvent!: IEventEdition;
  eventOptions: Observable<IEventEdition[] | null> = new Observable();
  isSaving = false;
  public copyEntriesForm: UntypedFormGroup;

  constructor(
    private _fb: UntypedFormBuilder,
    private eventEditionService: EventEditionService,
    private activeModal: NgbActiveModal
  ) {
    this.copyEntriesForm = this._fb.group({
      sourceEvent: new UntypedFormControl()
    });
  }

  ngOnInit(): void {
    this.displayFnEvents = this.displayFnEvents.bind(this);

    this.eventOptions = this.copyEntriesForm.get('sourceEvent')!.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.eventEditionService.query({
            query: value
          });
        } else {
          return of(null);
        }
      }),
      map(response => (response ? response.body : null))
    );
  }

  displayFnEvents(event?: any): string {
    return event ? event.longEventName as string : '';
  }

  setEvent(event: IEventEdition): void {
    this.sourceEvent = event;
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  copyEntries(): void {
    this.isSaving = true;
    this.eventEditionService
    .copyEntries(this.sourceEvent.id!, this.targetEvent.id!)
    .subscribe(() => this.activeModal.dismiss());
    this.isSaving = false;
  }
}
