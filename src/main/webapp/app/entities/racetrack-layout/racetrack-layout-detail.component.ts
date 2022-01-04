import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IRacetrackLayout } from '../../shared/model/racetrack-layout.model';

@Component({
  selector: 'jhi-racetrack-layout-detail',
  templateUrl: './racetrack-layout-detail.component.html'
})
export class RacetrackLayoutDetailComponent implements OnInit {
  racetrackLayout: IRacetrackLayout;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute, private titleService: Title) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((data: { layout: IRacetrackLayout }) => {
      this.racetrackLayout = data.layout;
      this.titleService.setTitle(`${racetrackLayout.racetrack.name as string} - ${racetrackLayout.name as string}`);
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
