import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IDriver } from 'app/shared/model/driver.model';

@Component({
  selector: 'jhi-driver-detail',
  templateUrl: './driver-detail.component.html'
})
export class DriverDetailComponent implements OnInit {
  driver: IDriver;
  compositeName: String;
  faceUrl: String;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ driver }) => {
      this.driver = driver;
      this.compositeName = driver.surname + ', ' + driver.name;
      this.faceUrl = this.driver.portraitUrl.replace('upload/', 'upload/w_300,h_300,c_thumb,g_face/');
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
