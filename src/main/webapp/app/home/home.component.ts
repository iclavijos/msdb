import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

export class HomeData {
  teams!: number;
  series!: number;
  racetracks!: number;
  drivers!: number;
  events!: number;
}

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  account: Account | null = null;
  homeData = new HomeData();

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => (this.account = account));
    this.httpClient.get<HomeData>('api/home')
      .subscribe((res: HomeData) => this.homeData = res);
  }

  login(): void {
    this.loginService.login();
  }
}
