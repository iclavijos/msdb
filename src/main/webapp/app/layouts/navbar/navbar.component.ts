import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';
import { JhiLanguageHelper } from 'app/core/language/language.helper';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/core/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  mobileMenuVisible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  private $layer: any;
  inProduction: boolean;
  languages: any[];
  swaggerEnabled: boolean;
  version: string;
  private userFullName: string;

  constructor(
    location: Location,
    private element: ElementRef,
    private loginService: LoginService,
    private languageService: JhiLanguageService,
    private languageHelper: JhiLanguageHelper,
    private sessionStorage: SessionStorageService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.location = location;
    this.sidebarVisible = false;
    this.version = VERSION ? (VERSION.toLowerCase().startsWith('v') ? VERSION : 'v' + VERSION) : '';
  }

  ngOnInit() {
    this.languages = this.languageHelper.getAll();

    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.swaggerEnabled = profileInfo.swaggerEnabled;
    });

    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe(() => {
      this.sidebarClose();
      this.$layer = document.getElementsByClassName('close-layer')[0];
      if (this.$layer) {
        this.$layer.remove();
        this.mobileMenuVisible = 0;
      }
    });
  }

  changeLanguage(languageKey: string) {
    this.sessionStorage.store('locale', languageKey);
    this.languageService.changeLanguage(languageKey);
  }

  isAuthenticated() {
    const authenticated = this.accountService.isAuthenticated();
    if (authenticated) {
      this.accountService.identity().subscribe(userIdentity => (this.userFullName = userIdentity.firstName + ' ' + userIdentity.lastName));
    }
    return authenticated;
  }

  login() {
    this.loginService.login();
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['']);
  }

  getImageUrl() {
    return this.isAuthenticated() ? this.accountService.getImageUrl() : null;
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function() {
      toggleButton.classList.add('toggled');
    }, 500);

    body.classList.add('nav-open');

    this.sidebarVisible = true;
  }
  sidebarClose() {
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    body.classList.remove('nav-open');
  }
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    const $toggle = document.getElementsByClassName('navbar-toggler')[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName('body')[0];

    if (this.mobileMenuVisible === 1) {
      // $('html').removeClass('nav-open');
      body.classList.remove('nav-open');
      if (this.$layer) {
        this.$layer.remove();
      }
      setTimeout(function() {
        $toggle.classList.remove('toggled');
      }, 400);

      this.mobileMenuVisible = 0;
    } else {
      setTimeout(function() {
        $toggle.classList.add('toggled');
      }, 430);

      const $layer = document.createElement('div');
      $layer.setAttribute('class', 'close-layer');

      if (body.querySelectorAll('.main-panel')) {
        document.getElementsByClassName('main-panel')[0].appendChild($layer);
      } else if (body.classList.contains('off-canvas-sidebar')) {
        document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
      }

      setTimeout(function() {
        $layer.classList.add('visible');
      }, 100);

      $layer.onclick = function() {
        // asign a function
        body.classList.remove('nav-open');
        this.mobileMenuVisible = 0;
        $layer.classList.remove('visible');
        setTimeout(function() {
          $layer.remove();
          $toggle.classList.remove('toggled');
        }, 400);
      }.bind(this);

      body.classList.add('nav-open');
      this.mobileMenuVisible = 1;
    }
  }
}
