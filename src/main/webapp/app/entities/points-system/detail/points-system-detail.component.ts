import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPointsSystem } from '../points-system.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-points-system-detail',
  templateUrl: './points-system-detail.component.html',
})
export class PointsSystemDetailComponent implements OnInit {
  pointsSystem: IPointsSystem | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pointsSystem }) => {
      this.pointsSystem = pointsSystem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
