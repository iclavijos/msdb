import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDriverPointsDetails } from 'app/shared/model/driver-points-details.model';

@Component({
  selector: 'jhi-driver-points-details-detail',
  templateUrl: './driver-points-details-detail.component.html'
})
export class DriverPointsDetailsDetailComponent implements OnInit {
  driverPointsDetails: IDriverPointsDetails;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ driverPointsDetails }) => {
      this.driverPointsDetails = driverPointsDetails;
    });
  }

  previousState() {
    window.history.back();
  }
}
