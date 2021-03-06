import { Title } from '@angular/platform-browser';
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

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute, private titleService: Title) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ driver }) => {
      this.driver = driver;
      this.titleService.setTitle(driver.name + ' ' + driver.surname);
      this.compositeName = driver.surname + ', ' + driver.name;
      const tmpFaceUrl = this.driver.portraitUrl
        ? this.driver.portraitUrl
        : 'https://res.cloudinary.com/msdb-cloud/image/upload/v1518113603/generic.png';
      this.faceUrl = tmpFaceUrl.replace('upload/', 'upload/w_300,h_300,c_thumb,g_face/');
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
