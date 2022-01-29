import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { EventEdition } from 'app/entities/event-edition/event-edition.model';
import { IEventEntry, EventEntry } from '../event-entry.model';
import { EventEntryService } from '../service/event-entry.service';
import { EventEntryUpdateComponent } from '../update/event-entry-update.component';
import { EventEntryDeleteDialogComponent } from '../delete/event-entry-delete-dialog.component';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-event-entry',
  templateUrl: './event-entry.component.html',
  styleUrls: ['./event-entry.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class EventEntryComponent implements OnInit, OnChanges {
  @Input() eventEdition!: EventEdition;
  eventEntries: IEventEntry[] = [];
  currentAccount: any;
  displayedColumns: string[] = ['raceNumber', 'tyres', 'drivers', 'buttons'];
  @Output() entries = new EventEmitter<IEventEntry[]>();
  categoryToFilter!: string;
  filteredEntries: IEventEntry[] = [];

  constructor(
    protected eventEntryService: EventEntryService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['eventEdition'];

    if (change.previousValue) {
      this.loadAll();
    }
  }

  loadAll(): void {
    this.eventEntryService.findEntries(this.eventEdition.id!).subscribe(entries => {
      this.eventEntries = entries.body ?? [];
      this.filterCategories();
      this.entries.emit(this.eventEntries);
    });
  }

  filterCategories(): void {
    this.filteredEntries = this.categoryToFilter
      ? this.eventEntries.filter(entry => entry.category!.shortname === this.categoryToFilter)
      : this.eventEntries;
  }

  addEntry(): void {
    const dialogRef = this.dialog.open(EventEntryUpdateComponent, {
      data: {
        eventEntry: new EventEntry(),
        eventEdition: this.eventEdition
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  editEntry(entry: IEventEntry): void {
    const dialogRef = this.dialog.open(EventEntryUpdateComponent, {
      data: {
        eventEntry: entry,
        eventEdition: this.eventEdition
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  delete(eventEntry: IEventEntry): void {
    const modalRef = this.modalService.open(EventEntryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.eventEntry = eventEntry;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }
}
