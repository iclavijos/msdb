import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { RacetrackLayoutService } from './racetrack-layout.service';

@Component({
  selector: 'jhi-racetrack-layout',
  templateUrl: './racetrack-layout.component.html'
})
export class RacetrackLayoutComponent implements OnInit, OnDestroy {
  racetrackLayouts: IRacetrackLayout[];
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected racetrackLayoutService: RacetrackLayoutService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll() {
    if (this.currentSearch) {
      this.racetrackLayoutService
        .search({
          query: this.currentSearch
        })
        .subscribe((res: HttpResponse<IRacetrackLayout[]>) => (this.racetrackLayouts = res.body));
      return;
    }
    this.racetrackLayoutService.query().subscribe((res: HttpResponse<IRacetrackLayout[]>) => {
      this.racetrackLayouts = res.body;
      this.currentSearch = '';
    });
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.registerChangeInRacetrackLayouts();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IRacetrackLayout) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInRacetrackLayouts() {
    this.eventSubscriber = this.eventManager.subscribe('racetrackLayoutListModification', () => this.loadAll());
  }
}
