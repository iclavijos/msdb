import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISeriesEdition } from 'app/shared/model/series-edition.model';

@Component({
    selector: 'jhi-series-edition-detail',
    templateUrl: './series-edition-detail.component.html'
})
export class SeriesEditionDetailComponent implements OnInit {
    seriesEdition: ISeriesEdition;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ seriesEdition }) => {
            this.seriesEdition = seriesEdition;
        });
    }

    previousState() {
        window.history.back();
    }
}
