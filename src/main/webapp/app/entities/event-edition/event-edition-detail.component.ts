import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventEdition } from 'app/shared/model/event-edition.model';

@Component({
    selector: 'jhi-event-edition-detail',
    templateUrl: './event-edition-detail.component.html'
})
export class EventEditionDetailComponent implements OnInit {
    eventEdition: IEventEdition;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ eventEdition }) => {
            this.eventEdition = eventEdition;
        });
    }

    previousState() {
        window.history.back();
    }
}
