import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IChassis } from 'app/shared/model/chassis.model';

@Component({
  selector: 'jhi-chassis-detail',
  templateUrl: './chassis-detail.component.html'
})
export class ChassisDetailComponent implements OnInit {
  chassis: IChassis;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ chassis }) => {
      this.chassis = chassis;
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
  previousState() {
    window.history.back();
  }
}
