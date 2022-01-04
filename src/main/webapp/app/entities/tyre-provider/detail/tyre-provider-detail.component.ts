import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITyreProvider } from '../tyre-provider.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-tyre-provider-detail',
  templateUrl: './tyre-provider-detail.component.html',
})
export class TyreProviderDetailComponent implements OnInit {
  tyreProvider!: ITyreProvider;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tyreProvider }) => {
      this.tyreProvider = tyreProvider;
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
