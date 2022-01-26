import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { AccountService } from '../core/auth/account.service';

import { ISeries } from '../shared/model/series.model';
import { SeriesService } from '../entities/series/series.service';

@Component({
  selector: 'jhi-subscriptions-component',
  templateUrl: './subscriptions.component.html'
})
export class SubscriptionsComponent implements OnInit {
  availableSeries: ISeries[] = [];
  subscriptions: any[] = [];
  currentFilter = '';

  public editForm: FormGroup;

  constructor(private fb: FormBuilder, private seriesService: SeriesService, private accountService: AccountService) {
    this.editForm = this.fb.group({
      seriesSubscriptions: this.fb.array([])
    });
  }

  ngOnInit() {

    this.seriesService.query({
      page: 0,
      query: '',
      size: 200,
      sort: ['name', 'asc']
    }).subscribe(series => {
      this.accountService.subscriptions().subscribe(res => {
        this.subscriptions = res;

        const control = this.editForm.get('seriesSubscriptions') as FormArray;
        series.body
          .sort((se1, se2) => (se1.name > se2.name ? 1 : -1))
          .forEach(s => control.push(this.initSeriesSubscription(s)));
      });
    });
  }

  isShown(editionName: string): boolean {
    return !this.currentFilter || editionName.toLowerCase().includes(this.currentFilter);
  }

  isRally(seriesName: string): boolean {
    const name = seriesName?.toLowerCase() ?? '';
    return name.includes('rally') && !name.includes('cross');
  }

  save(): void {
    this.accountService.updateSubscriptions(this.editForm.value.seriesSubscriptions).subscribe();
  }

  get seriesSubscriptionsFormGroups () {
    return this.editForm.get('seriesSubscriptions') as FormArray
  }

  private initSeriesSubscription(series: ISeries) {
    const subs = this.subscriptions.find(s => s.seriesId === series.id);
    return this.fb.group({
      seriesName: series.name,
      seriesId: series.id,
      practiceSessions: subs ? subs.practiceSessions : false,
      qualiSessions: subs ? subs.qualiSessions : false,
      races: subs ? subs.races : false,
      fifteenMinWarning: subs ? subs.fifteenMinWarning : false,
      oneHourWarning: subs ? subs.oneHourWarning : false,
      threeHoursWarning: subs ? subs.threeHoursWarning : false
    });
  }
}
