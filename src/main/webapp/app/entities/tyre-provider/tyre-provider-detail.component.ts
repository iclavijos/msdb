import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ITyreProvider } from '../../shared/model/tyre-provider.model';

@Component({
  selector: 'jhi-tyre-provider-detail',
  templateUrl: './tyre-provider-detail.component.html'
})
export class TyreProviderDetailComponent implements OnInit {
  tyreProvider: ITyreProvider;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute, private titleService: Title) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ tyreProvider }) => {
      this.tyreProvider = tyreProvider;
      this.titleService.setTitle(tyreProvider.name);
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
