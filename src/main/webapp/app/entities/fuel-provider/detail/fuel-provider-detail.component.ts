import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFuelProvider } from '../fuel-provider.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-fuel-provider-detail',
  templateUrl: './fuel-provider-detail.component.html',
})
export class FuelProviderDetailComponent implements OnInit {
  fuelProvider: IFuelProvider | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fuelProvider }) => {
      this.fuelProvider = fuelProvider;
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
