import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventEdition } from '../event-edition.model';

@Component({
  selector: 'jhi-event-edition-detail',
  templateUrl: './event-edition-detail.component.html',
})
export class EventEditionDetailComponent implements OnInit {
  eventEdition: IEventEdition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventEdition }) => {
      this.eventEdition = eventEdition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
