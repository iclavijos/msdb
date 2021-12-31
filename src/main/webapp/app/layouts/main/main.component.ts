import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd, NavigationError } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

import { JhiLanguageHelper } from '../../core/language/language.helper';
import { Account } from '../../core/user/account.model';
import { AccountService } from '../../core/auth/account.service';
import { StateStorageService } from '../../core/auth/state-storage.service';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class JhiMainComponent implements OnInit, OnDestroy, AfterViewInit {
  _cleanup: Subject<any> = new Subject<any>();

  backgroundNumber = 1;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private accountService: AccountService,
    private stateStorageService: StateStorageService,
    private jhiLanguageHelper: JhiLanguageHelper,
    private router: Router,
    private translateService: TranslateService,
    private dateAdapter: DateAdapter<any>,
    private breakpointObserver: BreakpointObserver
  ) {}

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
    let title: string = routeSnapshot.data && routeSnapshot.data['pageTitle'] ? routeSnapshot.data['pageTitle'] : 'motorsportsDatabaseApp';
    if (routeSnapshot.firstChild) {
      title = this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  ngOnInit() {
    this.backgroundNumber = Math.floor(Math.random() * 4) + 1;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
      }
      if (event instanceof NavigationError && event.error.status === 404) {
        this.router.navigate(['/404']);
      }
    });
    this.subscribeToLoginEvents();
  }

  ngAfterViewInit() {
    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.dateAdapter.setLocale(langChangeEvent.lang);
    });
  }

  ngOnDestroy() {
    this._cleanup.next();
    this._cleanup.complete();
    this.translateService.onLangChange.unsubscribe();
  }

  private subscribeToLoginEvents() {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this._cleanup))
      .subscribe((account: Account) => {
        if (account) {
          this.navigateToStoredUrl();
        }
      });
  }

  private navigateToStoredUrl() {
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.storeUrl(null);
      this.router.navigateByUrl(previousUrl);
    }
  }
}
