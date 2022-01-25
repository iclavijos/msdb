import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISeries } from '../series.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-series-detail',
  templateUrl: './series-detail.component.html',
})
export class SeriesDetailComponent implements OnInit {
  series: ISeries | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ series }) => {
      this.series = series;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
