import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { LoginService } from '../core/login/login.service';
import { AccountService } from '../core/auth/account.service';
import { Account } from '../core/user/account.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  account: Account;

  homeData: any;

  constructor(private accountService: AccountService, private loginService: LoginService, private http: HttpClient) {
    this.homeData = {};
  }

  ngOnInit() {
    this.accountService.identity().subscribe((account: Account) => {
      this.account = account;
    });
    this.http.get<HttpResponse<any>>('api/home').subscribe(res => (this.homeData = res));
  }
}
