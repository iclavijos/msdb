import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { JhiEventManager, JhiAlertService, JhiLanguageService } from 'ng-jhipster';

import { Observable } from 'rxjs/Rx';

import { SeriesEditionPopupService } from './series-edition-popup.service';
import { SeriesEditionService } from './series-edition.service';

@Component({
  selector: 'jhi-series-edition-calendar-dialog',
  templateUrl: './series-edition-clone-dialog.component.html'
})
export class SeriesEditionCloneDialogComponent implements OnInit {
  newPeriod: string;
  seriesEditionId: number;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private jhiLanguageService: JhiLanguageService,
    private jhiAlertService: JhiAlertService,
    private seriesEditionService: SeriesEditionService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.seriesEditionService.clone(this.seriesEditionId, this.newPeriod));
  }

  private subscribeToSaveResponse(result: Observable<any>) {
    result.subscribe((res: any) => this.onSaveSuccess(res), (res: Response) => this.onSaveError());
  }

  private onSaveSuccess(result: any) {
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }
}

@Component({
  selector: 'jhi-series-edition-clone-popup',
  template: ''
})
export class SeriesEditionClonePopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private seriesEditionPopupService: SeriesEditionPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.seriesEditionPopupService.openClone(SeriesEditionCloneDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
