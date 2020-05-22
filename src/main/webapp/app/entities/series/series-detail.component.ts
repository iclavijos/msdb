import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ISeries } from 'app/shared/model/series.model';

@Component({
  selector: 'jhi-series-detail',
  templateUrl: './series-detail.component.html'
})
export class SeriesDetailComponent implements OnInit {
  series: ISeries;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ series }) => {
      this.series = series;
    });
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  previousState() {
    window.history.back();
  }
}
