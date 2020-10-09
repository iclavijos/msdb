import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { SessionStorageService } from 'ngx-webstorage';

import { IRacetrack } from 'app/shared/model/racetrack.model';
import { RacetrackService } from './racetrack.service';
import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackLayoutService } from '../racetrack-layout/racetrack-layout.service';
import { IEventEdition } from 'app/shared/model/event-edition.model';

@Component({
  selector: 'jhi-racetrack-detail',
  templateUrl: './racetrack-detail.component.html'
})
export class RacetrackDetailComponent implements OnInit {
  racetrack: IRacetrack;
  racetrackLayouts: IRacetrackLayout[];
  eventsEditions: IEventEdition[];
  locale: string;

  displayedColumns: string[] = ['name', 'length', 'yearFirstUse', 'layoutImage', 'active', 'buttons'];
  eventsDisplayedColumns: string[] = ['date', 'eventName', 'layout', 'layoutImage'];

  constructor(
    protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    private racetrackService: RacetrackService,
    private racetrackLayoutService: RacetrackLayoutService,
    private sessionStorage: SessionStorageService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.locale = this.sessionStorage.retrieve('locale');
    this.activatedRoute.data.subscribe(({ racetrack }) => {
      this.racetrack = racetrack;
      this.titleService.setTitle(racetrack.name);
      this.loadLayouts(racetrack.id);
    });
  }

  loadLayouts(id) {
    this.racetrackService.findLayouts(id).subscribe((res: HttpResponse<IRacetrackLayout[]>) => {
      this.racetrackLayouts = res.body;
    });
    this.racetrackService.findNextEvents(id).subscribe((res: HttpResponse<IEventEdition[]>) => {
      this.eventsEditions = res.body;
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
