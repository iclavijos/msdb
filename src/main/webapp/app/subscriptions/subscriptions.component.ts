import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { AccountService } from '../core/auth/account.service';

import { ISeriesEdition } from '../shared/model/series-edition.model';
import { SeriesEditionService } from '../entities/series-edition/series-edition.service';

@Component({
  selector: 'jhi-subscriptions-component',
  templateUrl: 'subscriptions.component.html'
})
export class SubscriptionsComponent implements OnInit {
  availableSeries: ISeriesEdition[] = [];
  subscriptions: any[];
  currentFilter = '';

  public editForm: FormGroup;

  constructor(private fb: FormBuilder, private seriesEditionService: SeriesEditionService, private accountService: AccountService) {
    this.editForm = this.fb.group({
      seriesSubscriptions: this.fb.array([])
    });
  }

  ngOnInit() {
    this.seriesEditionService.findActiveSeries().subscribe(series => {
      this.accountService.subscriptions().subscribe(res => {
        this.subscriptions = res;

        const control = this.editForm.get('seriesSubscriptions') as FormArray;
        series.body
          .sort((se1, se2) => (se1.editionName > se2.editionName ? 1 : -1))
          .forEach(s => control.push(this.initSeriesSubscription(s)));
      });
    });
  }

  private initSeriesSubscription(seriesEdition: ISeriesEdition) {
    const subs = this.subscriptions.find(s => s.seriesEditionId === seriesEdition.id);
    return this.fb.group({
      editionName: seriesEdition.editionName,
      seriesEditionId: seriesEdition.id,
      practiceSessions: subs ? subs.practiceSessions : false,
      qualiSessions: subs ? subs.qualiSessions : false,
      races: subs ? subs.races : false,
      fifteenMinWarning: subs ? subs.fifteenMinWarning : false,
      oneHourWarning: subs ? subs.oneHourWarning : false,
      threeHoursWarning: subs ? subs.threeHoursWarning : false
    });
  }

  isShown(editionName: string): boolean {
    return !this.currentFilter || editionName.toLowerCase().includes(this.currentFilter);
  }

  save() {
    this.accountService.updateSubscriptions(this.editForm.value.seriesSubscriptions).subscribe(() => {});
  }
}
