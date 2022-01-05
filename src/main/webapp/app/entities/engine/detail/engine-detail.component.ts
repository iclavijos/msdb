import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEngine } from '../engine.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-engine-detail',
  templateUrl: './engine-detail.component.html',
})
export class EngineDetailComponent implements OnInit {
  engine: IEngine | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ engine }) => {
      this.engine = engine;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
