import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { EventEntryResult } from './event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';

@Component({
    selector: 'jhi-event-entry-result-detail',
    templateUrl: './event-entry-result-detail.component.html'
})
export class EventEntryResultDetailComponent implements OnInit, OnDestroy {

    eventEntryResult: EventEntryResult;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEntryResultService: EventEntryResultService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['eventEntryResult']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.eventEntryResultService.find(id).subscribe(eventEntryResult => {
            this.eventEntryResult = eventEntryResult;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
