import { Component, OnInit, OnDestroy, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { JhiEventManager, JhiAlertService, JhiLanguageService } from 'ng-jhipster';

import { SeriesEdition } from './series-edition.model';
import { SeriesEditionPopupService } from './series-edition-popup.service';
import { SeriesEditionService } from './series-edition.service';

@Component({
  selector: 'jhi-series-edition-teams-champions-dialog',
  templateUrl: './series-edition-teams-champions-dialog.component.html'
})
export class SeriesEditionTeamsChampionsDialogComponent implements OnInit {
  teams: any;
  seriesEditionId: number;
  isSaving: boolean;
  selectedDrivers: any;

  @ViewChildren('myItem') item;
  selectedIds = [];

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private seriesEditionService: SeriesEditionService
  ) {}

  ngOnInit() {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  onCheckboxSelect(id, event) {
    if (event.target.checked === true) {
      this.selectedIds.push(id);
    }
    if (event.target.checked === false) {
      this.selectedIds = this.selectedIds.filter(item => item !== id);
    }
  }

  save() {
    this.isSaving = true;
    this.seriesEditionService
      .setTeamsChampions(this.seriesEditionId, this.selectedIds)
      .subscribe((res: any) => this.onSaveSuccess(), (res: any) => this.onError(res));
  }

  private onSaveSuccess() {
    this.eventManager.broadcast({ name: 'teamsChampionsModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss();
  }

  private onError(error: any) {
    this.isSaving = false;
    this.jhiAlertService.error(error.message, null, null);
  }
}

@Component({
  selector: 'jhi-series-edition-teams-champions-popup',
  template: ''
})
export class SeriesEditionTeamsChampionsPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private seriesEditionPopupService: SeriesEditionPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.seriesEditionPopupService.openTeamsChamps(SeriesEditionTeamsChampionsDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
