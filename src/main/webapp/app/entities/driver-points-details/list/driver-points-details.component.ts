import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDriverPointsDetails } from '../driver-points-details.model';
import { DriverPointsDetailsService } from '../service/driver-points-details.service';
import { DriverPointsDetailsDeleteDialogComponent } from '../delete/driver-points-details-delete-dialog.component';

@Component({
  selector: 'jhi-driver-points-details',
  templateUrl: './driver-points-details.component.html',
})
export class DriverPointsDetailsComponent implements OnInit {
  driverPointsDetails?: IDriverPointsDetails[];
  isLoading = false;
  currentSearch: string;

  constructor(
    protected driverPointsDetailsService: DriverPointsDetailsService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  loadAll(): void {
    this.isLoading = true;
    if (this.currentSearch) {
      this.driverPointsDetailsService
        .search({
          query: this.currentSearch,
        })
        .subscribe(
          (res: HttpResponse<IDriverPointsDetails[]>) => {
            this.isLoading = false;
            this.driverPointsDetails = res.body ?? [];
          },
          () => {
            this.isLoading = false;
          }
        );
      return;
    }

    this.driverPointsDetailsService.query().subscribe(
      (res: HttpResponse<IDriverPointsDetails[]>) => {
        this.isLoading = false;
        this.driverPointsDetails = res.body ?? [];
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

  trackId(index: number, item: IDriverPointsDetails): number {
    return item.id!;
  }

  delete(driverPointsDetails: IDriverPointsDetails): void {
    const modalRef = this.modalService.open(DriverPointsDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.driverPointsDetails = driverPointsDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
