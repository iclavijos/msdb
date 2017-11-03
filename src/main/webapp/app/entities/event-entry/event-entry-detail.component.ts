import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';
import { EventEntry } from './event-entry.model';
import { EventEntryService } from './event-entry.service';

@Component({
    selector: 'jhi-event-entry-detail',
    templateUrl: './event-entry-detail.component.html'
})
export class EventEntryDetailComponent implements OnInit, OnDestroy {

    eventEntry: EventEntry;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private eventEntryService: EventEntryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEventEntries();
    }

    load(id) {
        this.eventEntryService.find(id).subscribe((eventEntry) => {
            this.eventEntry = eventEntry;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEventEntries() {
        this.eventSubscriber = this.eventManager.subscribe(
            'eventEntryListModification',
            (response) => this.load(this.eventEntry.id)
        );
    }
}
