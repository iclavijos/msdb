import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventEntry } from '../event-entry.model';

@Component({
  selector: 'jhi-event-entry-detail',
  templateUrl: './event-entry-detail.component.html',
})
export class EventEntryDetailComponent implements OnInit {
  eventEntry: IEventEntry | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventEntry }) => {
      this.eventEntry = eventEntry;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
