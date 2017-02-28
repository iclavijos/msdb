import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { SeriesEdition } from './series-edition.model';
import { SeriesEditionService } from './series-edition.service';

@Component({
    selector: 'jhi-series-edition-detail',
    templateUrl: './series-edition-detail.component.html'
})
export class SeriesEditionDetailComponent implements OnInit, OnDestroy {

    seriesEdition: SeriesEdition;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private seriesEditionService: SeriesEditionService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['seriesEdition']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.seriesEditionService.find(id).subscribe(seriesEdition => {
            this.seriesEdition = seriesEdition;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
