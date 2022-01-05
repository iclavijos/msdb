import { Component, OnInit, ElementRef } from '@angular/core';

import { ROUTES, RouteInfo } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/config/language.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit {
  location: Location;
  mobileMenuVisible: any = 0;
  inProduction?: boolean;
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  userFullName = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );

  private listTitles: RouteInfo[] = [];
  private toggleButton: any;
  private sidebarVisible: boolean;
  private $layer: any;

  constructor(
    location: Location,
    private element: ElementRef,
    private loginService: LoginService,
    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    private accountService: AccountService,
    private profileService: ProfileService,
    public router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.location = location;
    this.sidebarVisible = false;
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });
    this.accountService.getAuthenticationState().subscribe(account => (this.account = account));

    this.listTitles = ROUTES; // .filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe(() => {
      //       this.sidebarClose();
      this.$layer = document.getElementsByClassName('close-layer')[0];
      if (this.$layer) {
        this.$layer.remove();
        this.mobileMenuVisible = 0;
      }
    });
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
  }

  isAuthenticated(): boolean {
//     const authenticated = this.accountService.isAuthenticated();
//     if (authenticated) {
//       this.accountService.identity().subscribe(
//         (userIdentity: Account) =>
//           this.userFullName = `${String(userIdentity.firstName)} ${String(userIdentity.lastName)}`
//       );
//     }
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginService.login();
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }

  getImageUrl(): string | null {
    return this.isAuthenticated() ? this.accountService.getImageUrl() : null;
  }

}
