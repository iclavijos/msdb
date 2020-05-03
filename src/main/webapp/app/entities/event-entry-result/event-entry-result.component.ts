import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiDataUtils, JhiAlertService } from 'ng-jhipster';

import { EventEdition } from 'app/shared/model/event-edition.model';
import { EventSession } from 'app/shared/model/event-session.model';
import { IEventEntryResult } from 'app/shared/model/event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';

@Component({
  selector: 'jhi-event-entry-result',
  templateUrl: './event-entry-result.component.html'
})
export class EventEntryResultComponent implements OnInit, OnDestroy {
  @Input() eventEdition: EventEdition;
  @Input() eventSession: EventSession;
  eventEntryResults: IEventEntryResult[];
  currentAccount: any;
  eventSubscriber: Subscription;
  dataSource: MatTableDataSource<IEventEntryResult>;
  categoryToFilter: string;

  displayedColumns: string[];

  resultsLength = 0;
  isLoadingResults = true;

  constructor(
    protected eventEntryResultService: EventEntryResultService,
    protected parseLinks: JhiParseLinks,
    protected jhiAlertService: JhiAlertService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.registerChangeInEventEntryResults();
    this.loadAll();
    this.displayedColumns = ['position', 'tyres', 'driver', 'team']; //  'bestLapTime', 'lapsCompleted', 'lapsLed', 'retired', 'retirementCause', 'buttons'];

    if (this.eventEdition.allowedCategories.length > 1) {
      this.displayedColumns.push('category');
    }
    if (this.eventSession.sessionTypeValue === 2) {
      this.displayedColumns.push('totalTime');
    }
    this.displayedColumns.push('bestLapTime');
    if (this.eventSession.sessionTypeValue !== 2) {
      this.displayedColumns.push('difference', 'previous');
    }
    this.displayedColumns.push('lapsCompleted');
    if (this.eventSession.sessionTypeValue === 2) {
      this.displayedColumns.push('lapsLed', 'retired', 'retirementCause');
    }
    this.displayedColumns.push('buttons');
  }

  loadAll() {
    this.eventEntryResults = [];
    this.eventEntryResultService.query(this.eventEdition.id, this.eventSession.id).subscribe(res => {
      this.eventEntryResults = res.body;
      this.dataSource = new MatTableDataSource(res.body);
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.entry.category.shortname.toLowerCase().includes(filter);
      };
    });
  }

  classifiedNotRetired(eventEntryResult: IEventEntryResult) {
    return eventEntryResult.finalPosition > 1 && eventEntryResult.finalPosition <= 800 && !eventEntryResult.retired;
  }

  gap(currentLapTime: number, index: number) {
    let result: number;

    if (!this.categoryToFilter) {
      result = currentLapTime - this.dataSource.data[index].bestLapTime;
    } else {
      const filteredResults = this.dataSource.data.filter(res => res.entry.category.shortname.includes(this.categoryToFilter));
      result = currentLapTime - filteredResults[index].bestLapTime;
    }

    return result;
  }

  processResults() {
    this.jhiAlertService.info('motorsportsDatabaseApp.eventEdition.result.processResults.processing', null, null);
    this.eventEntryResultService
      .processSessionResults(this.eventSession.id)
      .subscribe(
        () => this.jhiAlertService.success('motorsportsDatabaseApp.eventEdition.result.processResults.processed', null, null),
        () => this.jhiAlertService.error('motorsportsDatabaseApp.eventEdition.result.processResults.notProcessed', null, null)
      );
  }

  filterCategory() {
    if (this.categoryToFilter) {
      this.dataSource.filter = this.categoryToFilter.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInEventEntryResults() {
    this.eventSubscriber = this.eventManager.subscribe('eventEntryResultListModification', () => this.loadAll());
  }
}
