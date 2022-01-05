import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDriverPointsDetails } from '../driver-points-details.model';

@Component({
  selector: 'jhi-driver-points-details-detail',
  templateUrl: './driver-points-details-detail.component.html',
})
export class DriverPointsDetailsDetailComponent implements OnInit {
  driverPointsDetails: IDriverPointsDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ driverPointsDetails }) => {
      this.driverPointsDetails = driverPointsDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
