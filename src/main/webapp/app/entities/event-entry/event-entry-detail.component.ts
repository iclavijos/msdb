import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { EventEntry } from './event-entry.model';
import { EventEntryService } from './event-entry.service';

@Component({
    selector: 'jhi-event-entry-detail',
    templateUrl: './event-entry-detail.component.html'
})
export class EventEntryDetailComponent implements OnInit, OnDestroy {

    eventEntry: EventEntry;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEntryService: EventEntryService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['eventEntry']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.eventEntryService.find(id).subscribe(eventEntry => {
            this.eventEntry = eventEntry;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
