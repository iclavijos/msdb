import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventEntryResult } from '../event-entry-result.model';

@Component({
  selector: 'jhi-event-entry-result-detail',
  templateUrl: './event-entry-result-detail.component.html',
})
export class EventEntryResultDetailComponent implements OnInit {
  eventEntryResult: IEventEntryResult | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventEntryResult }) => {
      this.eventEntryResult = eventEntryResult;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
