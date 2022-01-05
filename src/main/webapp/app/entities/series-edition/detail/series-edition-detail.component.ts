import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISeriesEdition } from '../series-edition.model';

@Component({
  selector: 'jhi-series-edition-detail',
  templateUrl: './series-edition-detail.component.html',
})
export class SeriesEditionDetailComponent implements OnInit {
  seriesEdition: ISeriesEdition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ seriesEdition }) => {
      this.seriesEdition = seriesEdition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
