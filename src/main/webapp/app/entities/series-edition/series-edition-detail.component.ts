import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager  } from 'ng-jhipster';

import { SeriesEdition } from './series-edition.model';
import { SeriesEditionService } from './series-edition.service';

@Component({
    selector: 'jhi-series-edition-detail',
    templateUrl: './series-edition-detail.component.html'
})
export class SeriesEditionDetailComponent implements OnInit, OnDestroy {

    seriesEdition: SeriesEdition;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private seriesEditionService: SeriesEditionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSeriesEditions();
    }

    load(id) {
        this.seriesEditionService.find(id).subscribe((seriesEdition) => {
            this.seriesEdition = seriesEdition;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSeriesEditions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'seriesEditionListModification',
            (response) => this.load(this.seriesEdition.id)
        );
    }
}
