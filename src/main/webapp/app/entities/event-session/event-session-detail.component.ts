import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { EventSession } from './event-session.model';
import { EventSessionService } from './event-session.service';

@Component({
    selector: 'jhi-event-session-detail',
    templateUrl: './event-session-detail.component.html'
})
export class EventSessionDetailComponent implements OnInit, OnDestroy {

    eventSession: EventSession;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventSessionService: EventSessionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.eventSessionService.find(id).subscribe(eventSession => {
            this.eventSession = eventSession;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
