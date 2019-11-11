import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { EventSession } from './event-session.model';
import { EventSessionService } from './event-session.service';

@Component({
    selector: 'jhi-event-session-detail',
    templateUrl: './event-session-detail.component.html'
})
export class EventSessionDetailComponent implements OnInit, OnDestroy {

    eventSession: EventSession;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private eventSessionService: EventSessionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEventSessions();
    }

    load(id) {
        this.eventSessionService.find(id).subscribe((eventSession) => {
            this.eventSession = eventSession;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEventSessions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'eventSessionListModification',
            (response) => this.load(this.eventSession.id)
        );
    }
}
