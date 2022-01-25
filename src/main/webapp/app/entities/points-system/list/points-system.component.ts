import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPointsSystem } from '../points-system.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { PointsSystemService } from '../service/points-system.service';
import { PointsSystemDeleteDialogComponent } from '../delete/points-system-delete-dialog.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'jhi-points-system',
  templateUrl: './points-system.component.html',
  styleUrls: ['./points-system.component.scss']
})
export class PointsSystemComponent implements OnInit, AfterViewInit {
  currentSearch: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;

  dataSource = new MatTableDataSource<IPointsSystem>([]);
  displayedColumns: string[] = [
      'name',
      'points',
      'pointsMostLeadLaps',
      'pointsFastLap',
      'pointsPole',
      'pointsLeadLap',
      'active',
      'buttons'
    ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sorter!: MatSort;

  constructor(
    protected pointsSystemService: PointsSystemService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadPage();
  }

  search(query: string): void {
    this.dataSource.filter = query.trim().toLowerCase();
  }

  trackId(index: number, item: IPointsSystem): number {
    return item.id!;
  }

  delete(event: MouseEvent, pointsSystem: IPointsSystem): void {
    event.stopPropagation();
    const modalRef = this.modalService.open(PointsSystemDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pointsSystem = pointsSystem;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  protected loadPage(): void {
    this.pointsSystemService
      .query({
        page: 0,
        query: this.currentSearch,
        size: this.itemsPerPage,
        sort: ['name,asc'],
      })
      .subscribe(
        (res: HttpResponse<IPointsSystem[]>) => {
          this.isLoading = false;
          this.totalItems = Number(res.headers.get('X-Total-Count'));
          this.dataSource.data = res.body ?? [];
          this.dataSource.sort = this.sorter;
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  protected sort(): string[] {
    return [this.predicate + ',' + (this.ascending ? ASC : DESC)];
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        // this.loadPage(pageNumber, true);
      }
    });
  }

  protected onError(): void {
    this.page = this.page ?? 1;
  }
}
