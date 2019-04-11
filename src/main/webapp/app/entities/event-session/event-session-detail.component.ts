import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventSession } from 'app/shared/model/event-session.model';

@Component({
    selector: 'jhi-event-session-detail',
    templateUrl: './event-session-detail.component.html'
})
export class EventSessionDetailComponent implements OnInit {
    eventSession: IEventSession;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ eventSession }) => {
            this.eventSession = eventSession;
        });
    }

    previousState() {
        window.history.back();
    }
}
