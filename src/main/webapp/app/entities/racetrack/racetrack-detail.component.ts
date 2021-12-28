import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils, JhiParseLinks } from 'ng-jhipster';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { SessionStorageService } from 'ngx-webstorage';

import { IRacetrack } from 'app/shared/model/racetrack.model';
import { RacetrackService } from './racetrack.service';
import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackLayoutService } from '../racetrack-layout/racetrack-layout.service';
import { IEventEdition } from 'app/shared/model/event-edition.model';

import { MatPaginator } from '@angular/material';

@Component({
  selector: 'jhi-racetrack-detail',
  templateUrl: './racetrack-detail.component.html',
  styleUrls: ['racetrack.component.scss']
})
export class RacetrackDetailComponent implements OnInit, AfterViewInit {
  racetrack: IRacetrack;
  racetrackLayouts: IRacetrackLayout[];
  nextEventsEditions: IEventEdition[];
  prevEventsEditions: IEventEdition[] = [];
  locale: string;
  currentScreenWidth: string;
  flexMediaWatcher: Subscription;
  links: any;
  totalItems: any;
  resultsLength = 0;

  displayedColumns: string[] = ['name', 'length', 'yearFirstUse', 'layoutImage', 'active', 'buttons'];
  nextEventsDisplayedColumns: string[] = ['date', 'eventName', 'layout', 'layoutImage'];
  prevEventsDisplayedColumns: string[] = ['date', 'prevEventName', 'winners'];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    protected dataUtils: JhiDataUtils,
    protected parseLinks: JhiParseLinks,
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

  ngAfterViewInit() {
    merge(this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.loadPreviousEvents(this.racetrack.id);
        }),
        map((data: HttpResponse<IEventEdition[]>) => {
          this.resultsLength = parseInt(data.headers.get('X-Total-Count'), 10);
          this.links = this.parseLinks.parse(data.headers.get('link'));
          this.totalItems = parseInt(data.headers.get('X-Total-Count'), 10);
          return data.body;
        }),
        catchError(() => {
          return observableOf([]);
        })
      )
      .subscribe(data => (this.prevEventsEditions = data));
  }

  loadLayouts(id) {
    this.racetrackService.findLayouts(id).subscribe((res: HttpResponse<IRacetrackLayout[]>) => {
      this.racetrackLayouts = res.body;
    });
    this.racetrackService.findNextEvents(id).subscribe((res: HttpResponse<IEventEdition[]>) => {
      this.nextEventsEditions = res.body;
    });
  }

  private loadPreviousEvents(id: number) {
    return this.racetrackService.findPrevEvents(id, {
      page: this.paginator.pageIndex,
      size: this.paginator.pageSize
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

  public concatDriverNames(drivers: any[]): string {
    return drivers.map(d => d.driverName).join(', ');
  }
}
