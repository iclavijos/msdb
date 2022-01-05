import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventSession } from '../event-session.model';

@Component({
  selector: 'jhi-event-session-detail',
  templateUrl: './event-session-detail.component.html',
})
export class EventSessionDetailComponent implements OnInit {
  eventSession: IEventSession | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventSession }) => {
      this.eventSession = eventSession;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
