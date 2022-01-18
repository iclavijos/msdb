import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  account: Account | null = null;

  homeData: any;

  constructor(private accountService: AccountService, private loginService: LoginService, private http: HttpClient) {
    this.homeData = {};
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => (this.account = account));
    this.http.get<HttpResponse<any>>('api/home').subscribe(res => (this.homeData = res));
  }

  login(): void {
    this.loginService.login();
  }
}
