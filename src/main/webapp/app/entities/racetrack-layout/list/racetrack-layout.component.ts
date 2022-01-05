import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRacetrackLayout } from '../racetrack-layout.model';
import { RacetrackLayoutService } from '../service/racetrack-layout.service';
import { RacetrackLayoutDeleteDialogComponent } from '../delete/racetrack-layout-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-racetrack-layout',
  templateUrl: './racetrack-layout.component.html',
})
export class RacetrackLayoutComponent implements OnInit {
  racetrackLayouts?: IRacetrackLayout[];
  isLoading = false;
  currentSearch: string;

  constructor(
    protected racetrackLayoutService: RacetrackLayoutService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  loadAll(): void {
    this.isLoading = true;
    if (this.currentSearch) {
      this.racetrackLayoutService
        .search({
          query: this.currentSearch,
        })
        .subscribe(
          (res: HttpResponse<IRacetrackLayout[]>) => {
            this.isLoading = false;
            this.racetrackLayouts = res.body ?? [];
          },
          () => {
            this.isLoading = false;
          }
        );
      return;
    }

    this.racetrackLayoutService.query().subscribe(
      (res: HttpResponse<IRacetrackLayout[]>) => {
        this.isLoading = false;
        this.racetrackLayouts = res.body ?? [];
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

  trackId(index: number, item: IRacetrackLayout): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(racetrackLayout: IRacetrackLayout): void {
    const modalRef = this.modalService.open(RacetrackLayoutDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.racetrackLayout = racetrackLayout;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
