import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventSession } from '../event-session.model';
import { EventSessionService } from '../service/event-session.service';
import { EventSessionDeleteDialogComponent } from '../delete/event-session-delete-dialog.component';

@Component({
  selector: 'jhi-event-session',
  templateUrl: './event-session.component.html',
})
export class EventSessionComponent implements OnInit {
  eventSessions?: IEventSession[];
  isLoading = false;
  currentSearch: string;

  constructor(
    protected eventSessionService: EventSessionService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  loadAll(): void {
    this.isLoading = true;
    if (this.currentSearch) {
      this.eventSessionService
        .search({
          query: this.currentSearch,
        })
        .subscribe(
          (res: HttpResponse<IEventSession[]>) => {
            this.isLoading = false;
            this.eventSessions = res.body ?? [];
          },
          () => {
            this.isLoading = false;
          }
        );
      return;
    }

    this.eventSessionService.query().subscribe(
      (res: HttpResponse<IEventSession[]>) => {
        this.isLoading = false;
        this.eventSessions = res.body ?? [];
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

  trackId(index: number, item: IEventSession): number {
    return item.id!;
  }

  delete(eventSession: IEventSession): void {
    const modalRef = this.modalService.open(EventSessionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.eventSession = eventSession;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
