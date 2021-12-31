import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiDataUtils, JhiAlertService } from 'ng-jhipster';

import { EventEdition } from '../../shared/model/event-edition.model';
import { EventSession } from '../../shared/model/event-session.model';
import { EventEntry } from '../../shared/model/event-entry.model';
import { IEventEntryResult, EventEntryResult } from '../../shared/model/event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';
import { EventEntryResultUpdateComponent } from './event-entry-result-update.component';
import { EventEntryUploadResultsComponent } from './event-entry-result-upload.component';
import { EventEntryResultUploadLapByLapComponent } from './event-entry-result-upload-lapbylap.component';
import { EventEntryResultDeleteDialogComponent } from './event-entry-result-delete-dialog.component';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-event-entry-result',
  templateUrl: './event-entry-result.component.html'
})
export class EventEntryResultComponent implements OnInit, OnDestroy {
  @Input() eventEdition: EventEdition;
  @Input() eventSession: EventSession;
  @Input() eventEntries: EventEntry[];
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
    protected eventManager: JhiEventManager,
    protected dialog: MatDialog
  ) {}

  ngOnInit() {
    this.registerChangeInEventEntryResults();
    this.loadAll();
    this.displayedColumns = ['position', 'tyres', 'driver', 'team'];

    if (this.eventEdition.allowedCategories.length > 1) {
      this.displayedColumns.push('category');
    }
    if (this.eventSession.sessionTypeValue === 2 || this.eventSession.sessionTypeValue === 4) {
      this.displayedColumns.push('totalTime');
    }
    if (this.eventSession.sessionTypeValue !== 4) {
      this.displayedColumns.push('bestLapTime');
    }
    if (this.eventSession.sessionTypeValue !== 2 && this.eventSession.sessionTypeValue !== 4) {
      this.displayedColumns.push('difference', 'previous');
    }
    this.displayedColumns.push('lapsCompleted');
    if (this.eventSession.sessionTypeValue === 2) {
      this.displayedColumns.push('lapsLed');
    }
    if (this.eventSession.sessionTypeValue === 2 || this.eventSession.sessionTypeValue === 4) {
      this.displayedColumns.push('retired', 'retirementCause');
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

  addResult() {
    const dialogRef = this.dialog.open(EventEntryResultUpdateComponent, {
      data: {
        eventEntryResult: new EventEntryResult(),
        eventSession: this.eventSession,
        eventEntries: this.eventEntries,
        eventEdition: this.eventEdition
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  editResult(result: EventEntryResult) {
    const dialogRef = this.dialog.open(EventEntryResultUpdateComponent, {
      data: {
        eventEntryResult: result,
        eventSession: this.eventSession,
        eventEntries: this.eventEntries,
        eventEdition: this.eventEdition
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadAll();
      }
    });
  }

  deleteResult(result: EventEntryResult) {
    const dialogRef = this.dialog.open(EventEntryResultDeleteDialogComponent, {
      data: {
        eventEntryResult: result
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadAll();
      }
    });
  }

  uploadResults() {
    const dialogRef = this.dialog.open(EventEntryUploadResultsComponent, {
      data: {
        eventSession: this.eventSession
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadAll();
      }
    });
  }

  uploadLapByLap() {
    this.dialog.open(EventEntryResultUploadLapByLapComponent, {
      data: {
        eventSession: this.eventSession
      }
    });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInEventEntryResults() {
    this.eventSubscriber = this.eventManager.subscribe('eventEntryResultListModification', () => this.loadAll());
  }
}
