import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Event } from './event.model';
import { EventService } from './event.service';

@Component({
    selector: 'jhi-event-detail',
    templateUrl: './event-detail.component.html'
})
export class EventDetailComponent implements OnInit, OnDestroy {

    event: Event;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventService: EventService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['event']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.eventService.find(id).subscribe(event => {
            this.event = event;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
