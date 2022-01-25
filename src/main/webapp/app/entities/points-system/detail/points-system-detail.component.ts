import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPointsSystem } from '../points-system.model';

@Component({
  selector: 'jhi-points-system-detail',
  templateUrl: './points-system-detail.component.html',
})
export class PointsSystemDetailComponent implements OnInit {
  pointsSystem: IPointsSystem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pointsSystem }) => {
      this.pointsSystem = pointsSystem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
