import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { EventEdition } from './event-edition.model';
import { EventEditionService } from './event-edition.service';

@Component({
    selector: 'jhi-event-edition-detail',
    templateUrl: './event-edition-detail.component.html'
})
export class EventEditionDetailComponent implements OnInit, OnDestroy {

    eventEdition: EventEdition;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEditionService: EventEditionService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['eventEdition']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.eventEditionService.find(id).subscribe(eventEdition => {
            this.eventEdition = eventEdition;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
