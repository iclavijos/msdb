import { Component, OnInit } from '@angular/core';

import { LoginService } from 'app/core/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';

import { HomeData } from './home.model';

import * as moment from 'moment-timezone';
import { isMoment } from 'moment-timezone';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
  account: Account;
  homeData: HomeData = new HomeData(); //Not a nice solution. Should find out what to use (Promise? Observable? ???)
  searchEntriesStr: string;
  searchEventsStr: string;
  calendar: any;
  noEvents = false;
  timezone: any;
  timezones: any;
  dates = new Set();

  constructor(private accountService: AccountService, private loginService: LoginService) {}

  ngOnInit() {
    this.timezone = moment.tz.guess();
    if (this.timezone === undefined) {
      this.timezone = 'Europe/London';
    }
    this.accountService.identity().subscribe((account: Account) => {
      this.account = account;
    });
    this.registerAuthenticationSuccess();
    this.http.get('api/home').subscribe((res: Response) => {
      this.homeData = res.json();
    });
    this.http.get('api/home/calendar').subscribe((res: Response) => {
      this.calendar = this.convertData(res.json(), this.timezone);
      this.noEvents = this.calendar.length === 0;
    });
    this.http.get('api/timezones').subscribe((res: Response) => {
      this.timezones = res.json();
    });
  }

  private convertData(data, tz) {
    this.dates = new Set();
    for (let i = 0; i < data.length; i++) {
      if (isMoment(data[i].sessionStartTime)) {
        data[i].sessionStartTime.tz(tz);
        data[i].sessionEndTime.tz(tz);
      } else {
        data[i].sessionStartTime = moment(data[i].sessionStartTime * 1000).tz(tz);
        data[i].sessionEndTime = moment(data[i].sessionEndTime * 1000).tz(tz);
      }
      this.dates.add(data[i].sessionStartTime.tz(tz).format('LL'));
    }
    return data;
  }

  filteredSessions(day) {
    return this.calendar.filter(item => item.sessionStartTime.format('LL') === day);
  }

  changeTimezone() {
    this.calendar = this.convertData(this.calendar, this.timezone);
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  login() {
    this.loginService.login();
  }
  searchEntries(query) {
    if (!query) {
      return this.clearEntries();
    }
    this.router.navigate(['/homeEntries', { search: this.searchEntriesStr }]);
  }

  searchEvents(query) {
    if (!query) {
      return this.clearEvents();
    }
    this.router.navigate(['/homeEvents', { search: this.searchEventsStr }]);
  }

  clearEntries() {
    this.searchEntriesStr = '';
  }

  clearEvents() {
    this.searchEventsStr = '';
  }
}
