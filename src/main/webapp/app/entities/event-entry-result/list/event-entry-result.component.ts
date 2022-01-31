import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { DataUtils } from 'app/core/util/data-util.service';
import { AlertService } from 'app/core/util/alert.service';

import { IEventEdition } from 'app/entities/event-edition/event-edition.model';
import { IEventSession } from 'app/entities/event-session/event-session.model';
import { IEventEntry } from 'app/entities/event-entry/event-entry.model';
import { ICategory } from 'app/entities/category/category.model';
import { IEventEntryResult, EventEntryResult } from '../event-entry-result.model';
import { EventEntryResultService } from '../service/event-entry-result.service';
import { EventEntryResultUpdateComponent } from '../update/event-entry-result-update.component';
import { EventEntryUploadResultsComponent } from '../upload/event-entry-result-upload.component';
import { EventEntryResultUploadLapByLapComponent } from '../upload/event-entry-result-upload-lapbylap.component';
import { EventEntryResultDeleteDialogComponent } from '../delete/event-entry-result-delete-dialog.component';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-event-entry-result',
  templateUrl: './event-entry-result.component.html',
})
export class EventEntryResultComponent implements OnInit {
  @Input() eventEdition!: IEventEdition;
  @Input() eventSession!: IEventSession;
  @Input() eventEntries!: IEventEntry[];
  eventEntryResults: IEventEntryResult[] = [];
  dataSource!: MatTableDataSource<IEventEntryResult>;
  categoryToFilter = '';

  displayedColumns: string[] = [];

  resultsLength = 0;
  isLoading = false;

  constructor(
    protected eventEntryResultService: EventEntryResultService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: DataUtils,
    protected router: Router,
    protected alertService: AlertService,
    protected dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.displayedColumns = ['position', 'tyres', 'driver', 'team'];

    if (this.getEventAllowedCategories().length > 1) {
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

  loadAll(): void {
    this.eventEntryResults = [];
    this.eventEntryResultService.query(this.eventEdition.id!, this.eventSession.id!).subscribe(res => {
      this.eventEntryResults = res.body ?? [];
      this.dataSource = new MatTableDataSource(this.eventEntryResults);
      this.dataSource.filterPredicate = function(data: IEventEntryResult, filter: string): boolean {
        return data.entry!.category?.shortname!.toLowerCase().includes(filter) as boolean;
      };
    });
  }

  classifiedNotRetired(eventEntryResult: IEventEntryResult): boolean {
    return eventEntryResult.finalPosition! > 1 && eventEntryResult.finalPosition! <= 800 && !eventEntryResult.retired;
  }

  getEventAllowedCategories(): ICategory[] {
    return this.eventEdition.allowedCategories ?? [];
  }

  gap(currentLapTime: number, index: number): number {
    let result: number;

    if (!this.categoryToFilter) {
      result = currentLapTime - this.dataSource.data[index].bestLapTime!;
    } else {
      const filteredResults = this.dataSource.data.filter(res => res.entry!.category?.shortname!.includes(this.categoryToFilter));
      result = currentLapTime - filteredResults[index].bestLapTime!;
    }

    return result;
  }

  processResults(): void {
    // this.jhiAlertService.info('motorsportsDatabaseApp.eventEdition.result.processResults.processing', null, null);
    this.eventEntryResultService
      .processSessionResults(this.eventSession.id!)
      .subscribe(
        () => this.alertService.addAlert({
                type: 'success',
                translationKey: 'motorsportsDatabaseApp.eventEdition.result.processResults.processed',
                translationParams: { },
              }),
        () => this.alertService.addAlert({
                type: 'danger',
                translationKey: 'motorsportsDatabaseApp.eventEdition.result.processResults.notProcessed',
                translationParams: { },
              })
      );
  }

  filterCategory(): void {
    if (this.categoryToFilter) {
      this.dataSource.filter = this.categoryToFilter.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }
  }

  addResult(): void {
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

  editResult(result: EventEntryResult): void {
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

  deleteResult(result: EventEntryResult): void {
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

  uploadResults(): void {
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

  uploadLapByLap(): void {
    this.dialog.open(EventEntryResultUploadLapByLapComponent, {
      data: {
        eventSession: this.eventSession
      }
    });
  }
}
