import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IRacetrack } from 'app/shared/model/racetrack.model';
import { RacetrackService } from './racetrack.service';
import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackLayoutService } from '../racetrack-layout/racetrack-layout.service';

@Component({
  selector: 'jhi-racetrack-detail',
  templateUrl: './racetrack-detail.component.html'
})
export class RacetrackDetailComponent implements OnInit {
  racetrack: IRacetrack;
  racetrackLayouts: IRacetrackLayout[];

  constructor(
    protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    private racetrackService: RacetrackService,
    private racetrackLayoutService: RacetrackLayoutService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ racetrack }) => {
      this.racetrack = racetrack;
      this.loadLayouts(racetrack.id);
    });
  }

  loadLayouts(id) {
    this.racetrackService.findLayouts(id).subscribe((res: HttpResponse<IRacetrackLayout[]>) => {
      this.racetrackLayouts = res.body;
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  previousState() {
    window.history.back();
  }
}
