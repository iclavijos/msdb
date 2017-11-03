import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { EventEntryResult } from './event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';

@Component({
    selector: 'jhi-event-entry-result-detail',
    templateUrl: './event-entry-result-detail.component.html'
})
export class EventEntryResultDetailComponent implements OnInit, OnDestroy {

    eventEntryResult: EventEntryResult;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private eventEntryResultService: EventEntryResultService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEventEntryResults();
    }

    load(id) {
        this.eventEntryResultService.find(id).subscribe((eventEntryResult) => {
            this.eventEntryResult = eventEntryResult;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEventEntryResults() {
        this.eventSubscriber = this.eventManager.subscribe(
            'eventEntryResultListModification',
            (response) => this.load(this.eventEntryResult.id)
        );
    }
}
