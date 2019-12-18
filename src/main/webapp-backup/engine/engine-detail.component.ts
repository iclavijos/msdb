import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IEngine } from 'app/shared/model/engine.model';

@Component({
  selector: 'jhi-engine-detail',
  templateUrl: './engine-detail.component.html'
})
export class EngineDetailComponent implements OnInit {
  engine: IEngine;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ engine }) => {
      this.engine = engine;
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
