import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPointsSystem } from '../../shared/model/points-system.model';

@Component({
  selector: 'jhi-points-system-detail',
  templateUrl: './points-system-detail.component.html'
})
export class PointsSystemDetailComponent implements OnInit {
  pointsSystem: IPointsSystem;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ pointsSystem }) => {
      this.pointsSystem = pointsSystem;
    });
  }

  previousState() {
    window.history.back();
  }
}
