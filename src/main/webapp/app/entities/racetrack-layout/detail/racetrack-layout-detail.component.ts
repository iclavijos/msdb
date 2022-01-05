import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRacetrackLayout } from '../racetrack-layout.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-racetrack-layout-detail',
  templateUrl: './racetrack-layout-detail.component.html',
})
export class RacetrackLayoutDetailComponent implements OnInit {
  racetrackLayout: IRacetrackLayout | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ racetrackLayout }) => {
      this.racetrackLayout = racetrackLayout;
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
