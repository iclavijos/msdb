import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { ClipboardService } from 'ngx-clipboard';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { JhiAlertService } from 'ng-jhipster';

@Component({
  selector: 'jhi-series-edition-calendar-subscription-dialog',
  templateUrl: './series-edition-calendar-subscription-dialog.component.html'
})
export class SeriesEditionCalendarSubscriptionDialogComponent implements OnInit {
  seriesEditionId: number;
  instructionsContent: SafeHtml;

  private calendarUrl = '/api/icalendar/';
  private linkToCalendar: string;

  constructor(
    private dialogRef: MatDialogRef<SeriesEditionCalendarSubscriptionDialogComponent>,
    private clipboardService: ClipboardService,
    private sanitizer: DomSanitizer,
    private alertService: JhiAlertService,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.seriesEditionId = data.seriesId;
    this.linkToCalendar = `${location.origin}${this.calendarUrl}${this.seriesEditionId}`;
  }

  ngOnInit() {
    this.changePlatform('google');
  }

  copyToClipboard() {
    if (this.clipboardService.copyFromContent(this.linkToCalendar)) {
      this.alertService.success('copiado', null, null);
    } else {
      this.alertService.error('no copiad', null, null);
    }
  }

  importToGoogle() {
    const link = `https://calendar.google.com/calendar/r?cid=${this.linkToCalendar}`;
    window.open(link, 'importCalendar');
  }

  changePlatform(platform: string) {
    fetch(`/html/calendar/${platform}-${this.translateService.currentLang}.html`)
      .then(res => res.text())
      .then(data => {
        this.instructionsContent = this.sanitizer.bypassSecurityTrustHtml(data);
      });
  }

  close() {
    this.dialogRef.close();
  }
}
