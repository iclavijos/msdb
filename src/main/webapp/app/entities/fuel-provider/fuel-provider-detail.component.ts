import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IFuelProvider } from 'app/shared/model/fuel-provider.model';

@Component({
  selector: 'jhi-fuel-provider-detail',
  templateUrl: './fuel-provider-detail.component.html'
})
export class FuelProviderDetailComponent implements OnInit {
  fuelProvider: IFuelProvider;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute, private titleService: Title) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ fuelProvider }) => {
      this.fuelProvider = fuelProvider;
      this.titleService.setTitle(fuelProvider.name);
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
