import { Component, OnInit, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRacetrack } from 'app/entities/racetrack/racetrack.model';
import { IRacetrackLayout, RacetrackLayout } from '../racetrack-layout.model';
import { RacetrackLayoutService } from '../service/racetrack-layout.service';
import { RacetrackLayoutUpdateComponent } from '../update/racetrack-layout-update.component';
import { RacetrackLayoutDeleteDialogComponent } from '../delete/racetrack-layout-delete-dialog.component';
import { AccountService } from 'app/core/auth/account.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-racetrack-layout',
  templateUrl: './racetrack-layout.component.html',
})
export class RacetrackLayoutComponent implements OnInit {
  @Input() racetrack!: IRacetrack;
  isLoading = false;

  displayedColumns: string[] = ['name', 'length', 'yearFirstUse', 'layoutImage', 'active'];

  dataSource = new MatTableDataSource<IRacetrackLayout>([]);

  constructor(
    protected racetrackLayoutService: RacetrackLayoutService,
    protected accountService: AccountService,
    protected modalService: NgbModal,
    private dialog: MatDialog
  ) {
  }

  loadAll(): void {
    this.isLoading = true;
    this.racetrackLayoutService.findRacetrackLayouts(this.racetrack.id!)
      .subscribe(
        (res: HttpResponse<IRacetrackLayout[]>) => {
          this.isLoading = false;
          this.dataSource.data = res.body ?? [];
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  ngOnInit(): void {
    if (this.accountService.hasAnyAuthority(["ROLE_ADMIN", "ROLE_EDITOR"])) {
      this.displayedColumns.push('buttons');
    }
    this.loadAll();
  }

  trackId(index: number, item: IRacetrackLayout): number {
    return item.id!;
  }

  createLayout(): void {
    const newLayout = new RacetrackLayout();
    newLayout.racetrack = this.racetrack;
    const dialogRef = this.dialog.open(RacetrackLayoutUpdateComponent, {
      data: {
        racetrackLayout: newLayout
      }
    });

    dialogRef.afterClosed().subscribe(reason => {
      if (reason === 'updatedLayout') {
        this.loadAll();
      }
    });
  }

  editLayout(layout: IRacetrackLayout): void {
    layout.racetrack = this.racetrack;
    const dialogRef = this.dialog.open(RacetrackLayoutUpdateComponent, {
      data: {
        racetrackLayout: layout
      }
    });

    dialogRef.afterClosed().subscribe(reason => {
      if (reason === 'updatedLayout') {
        this.loadAll();
      }
    });
  }


  delete(event: MouseEvent, racetrackLayout: IRacetrackLayout): void {
    event.stopPropagation();
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
