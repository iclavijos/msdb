import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventEntryResult } from '../event-entry-result.model';
import { EventEntryResultService } from '../service/event-entry-result.service';
import { EventEntryResultDeleteDialogComponent } from '../delete/event-entry-result-delete-dialog.component';

@Component({
  selector: 'jhi-event-entry-result',
  templateUrl: './event-entry-result.component.html',
})
export class EventEntryResultComponent implements OnInit {
  eventEntryResults?: IEventEntryResult[];
  isLoading = false;
  currentSearch: string;

  constructor(
    protected eventEntryResultService: EventEntryResultService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  loadAll(): void {
    this.isLoading = true;
    if (this.currentSearch) {
      this.eventEntryResultService
        .search({
          query: this.currentSearch,
        })
        .subscribe(
          (res: HttpResponse<IEventEntryResult[]>) => {
            this.isLoading = false;
            this.eventEntryResults = res.body ?? [];
          },
          () => {
            this.isLoading = false;
          }
        );
      return;
    }

    this.eventEntryResultService.query().subscribe(
      (res: HttpResponse<IEventEntryResult[]>) => {
        this.isLoading = false;
        this.eventEntryResults = res.body ?? [];
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

  trackId(index: number, item: IEventEntryResult): number {
    return item.id!;
  }

  delete(eventEntryResult: IEventEntryResult): void {
    const modalRef = this.modalService.open(EventEntryResultDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.eventEntryResult = eventEntryResult;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
