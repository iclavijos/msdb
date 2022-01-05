import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChassis } from '../chassis.model';

@Component({
  selector: 'jhi-chassis-detail',
  templateUrl: './chassis-detail.component.html',
})
export class ChassisDetailComponent implements OnInit {
  chassis: IChassis | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chassis }) => {
      this.chassis = chassis;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
