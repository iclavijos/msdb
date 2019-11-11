import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventEntryResult } from 'app/shared/model/event-entry-result.model';

@Component({
  selector: 'jhi-event-entry-result-detail',
  templateUrl: './event-entry-result-detail.component.html'
})
export class EventEntryResultDetailComponent implements OnInit {
  eventEntryResult: IEventEntryResult;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ eventEntryResult }) => {
      this.eventEntryResult = eventEntryResult;
    });
  }

  previousState() {
    window.history.back();
  }
}
