import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventEntry } from '../event-entry.model';
import { EventEntryService } from '../service/event-entry.service';
import { EventEntryDeleteDialogComponent } from '../delete/event-entry-delete-dialog.component';

@Component({
  selector: 'jhi-event-entry',
  templateUrl: './event-entry.component.html',
})
export class EventEntryComponent implements OnInit {
  eventEntries?: IEventEntry[];
  isLoading = false;
  currentSearch: string;

  constructor(protected eventEntryService: EventEntryService, protected modalService: NgbModal, protected activatedRoute: ActivatedRoute) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  loadAll(): void {
    this.isLoading = true;
    if (this.currentSearch) {
      this.eventEntryService
        .search({
          query: this.currentSearch,
        })
        .subscribe(
          (res: HttpResponse<IEventEntry[]>) => {
            this.isLoading = false;
            this.eventEntries = res.body ?? [];
          },
          () => {
            this.isLoading = false;
          }
        );
      return;
    }

    this.eventEntryService.query().subscribe(
      (res: HttpResponse<IEventEntry[]>) => {
        this.isLoading = false;
        this.eventEntries = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEventEntry): number {
    return item.id!;
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
}
