import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager  } from 'ng-jhipster';

import { EventEdition } from './event-edition.model';
import { EventEditionService } from './event-edition.service';

@Component({
    selector: 'jhi-event-edition-detail',
    templateUrl: './event-edition-detail.component.html'
})
export class EventEditionDetailComponent implements OnInit, OnDestroy {

    eventEdition: EventEdition;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private eventEditionService: EventEditionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEventEditions();
    }

    load(id) {
        this.eventEditionService.find(id).subscribe((eventEdition) => {
            this.eventEdition = eventEdition;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEventEditions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'eventEditionListModification',
            (response) => this.load(this.eventEdition.id)
        );
    }
}
