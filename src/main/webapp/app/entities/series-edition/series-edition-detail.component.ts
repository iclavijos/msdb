import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventManager, JhiLanguageService } from 'ng-jhipster';
import { Subscription } from 'rxjs/Rx';
import { SeriesEdition } from './series-edition.model';
import { SeriesEditionService } from './series-edition.service';

@Component({
    selector: 'jhi-series-edition-detail',
    templateUrl: './series-edition-detail.component.html'
})
export class SeriesEditionDetailComponent implements OnInit, OnDestroy {

    seriesEdition: SeriesEdition;
    eventSubscriber: Subscription;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private seriesEditionService: SeriesEditionService,
        private eventManager: EventManager,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
        this.eventSubscriber = this.eventManager.subscribe('seriesEditionEventsListModification', (response) => this.loadEvents(this.seriesEdition.id));
    }

    load (id) {
        this.seriesEditionService.find(id).subscribe(seriesEdition => {
            this.seriesEdition = seriesEdition;
            this.loadEvents(id);
        });
    }
    
    loadEvents(id) {
        this.seriesEditionService.findEvents(id).subscribe(events => {
           this.seriesEdition.events = events.json(); 
        });
    }
    
    previousState() {
        this.router.navigate(['/series', this.seriesEdition.series.id]);
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

}
