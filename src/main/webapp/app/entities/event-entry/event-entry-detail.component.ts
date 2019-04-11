import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventEntry } from 'app/shared/model/event-entry.model';

@Component({
    selector: 'jhi-event-entry-detail',
    templateUrl: './event-entry-detail.component.html'
})
export class EventEntryDetailComponent implements OnInit {
    eventEntry: IEventEntry;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ eventEntry }) => {
            this.eventEntry = eventEntry;
        });
    }

    previousState() {
        window.history.back();
    }
}
