import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from '@angular/core';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  iconClass: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/driver', title: 'global.menu.entities.driver', icon: '', iconClass: 'icofont icofont-racer', class: '' },
  { path: '/event', title: 'global.menu.entities.event', icon: '', iconClass: 'icofont icofont-racing-flag-alt', class: '' },
  { path: '/series', title: 'global.menu.entities.series', icon: '', iconClass: 'icofont icofont-trophy', class: '' },
  { path: '/racetrack', title: 'global.menu.entities.racetrack', icon: '', iconClass: 'icofont icofont-whistle', class: '' },
  { path: '/team', title: 'global.menu.entities.team', icon: '', iconClass: 'icofont icofont-workers-group', class: '' },
  { path: '/chassis', title: 'global.menu.entities.chassis', icon: '', iconClass: 'icofont icofont-racing-car', class: '' },
  { path: '/engine', title: 'global.menu.entities.engine', icon: '', iconClass: 'mdi mdi-piston', class: '' },
  { path: '/tyre-provider', title: 'global.menu.entities.tyreProvider', icon: '', iconClass: 'icofont icofont-lemon-alt', class: '' },
  { path: '/fuel-provider', title: 'global.menu.entities.fuelProvider', icon: '', iconClass: 'mdi mdi-fuel', class: '' }
];

export const RESTRICTED_ROUTES: RouteInfo[] = [
  { path: '/category', title: 'global.menu.entities.category', icon: '', iconClass: 'icofont icofont-listing-number', class: '' },
  { path: '/points-system', title: 'global.menu.entities.pointsSystem', icon: '', iconClass: 'icofont icofont-listing-number', class: '' }
];

@Component({
  selector: 'jhi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems = ROUTES;
  restrictedMenuItems = RESTRICTED_ROUTES;
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight!: string;
  listMaxWidth!: string;
  headerHeight = 60;
  routerObj: Subscription = new Subscription();
  currentRoute!: string;
  isDarkSidebar = false;
  isDarkTheme = false;
  selectedBgColor = 'white';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private router: Router
  ) {
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  windowResizecall(): void {
    this.setMenuHeight();
    this.checkStatuForResize();
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }

  ngOnInit(): void {
    const theme = localStorage.getItem('theme') ?? 'light';
    if (theme === 'light') {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
      this.isDarkTheme = true;
    }
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }

  ngOnDestroy(): void {
    this.routerObj.unsubscribe();
  }

  initLeftSidebar(): void {
    // Set menu height
    this.setMenuHeight();
    this.checkStatuForResize();
  }

  setMenuHeight(): void {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = `${height}`;
    this.listMaxWidth = '500px';
  }

  isOpen(): boolean {
    return this.bodyTag.classList.contains('overlay-open') as boolean;
  }

  checkStatuForResize(): void {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }

  mouseHover(): void {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }

  mouseOut(): void {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }

  switchTheme(event: MatSlideToggleChange): void {
    if (event.checked) {
      this.enableDarkMode();
    } else {
      this.enableLightMode();
    }
  }

  enableLightMode(): void {
    const theme = 'light';
    this.renderer.removeClass(this.document.body, 'menu_dark');
    this.renderer.removeClass(this.document.body, 'logo-black');
    this.renderer.addClass(this.document.body, 'menu_light');
    this.renderer.addClass(this.document.body, 'logo-white');

    this.renderer.removeClass(this.document.body, 'dark');
    this.renderer.removeClass(this.document.body, 'submenu-closed');
    this.renderer.removeClass(this.document.body, 'menu_dark');
    this.renderer.removeClass(this.document.body, 'logo-black');
    if (localStorage.getItem('choose_skin')) {
      this.renderer.removeClass(
        this.document.body,
        localStorage.getItem('choose_skin') ?? 'light'
      );
      this.renderer.addClass(this.document.body, 'theme-white');
    }

    this.renderer.addClass(this.document.body, 'light');
    this.renderer.addClass(this.document.body, 'submenu-closed');
    this.renderer.addClass(this.document.body, 'menu_light');
    this.renderer.addClass(this.document.body, 'logo-white');

    this.selectedBgColor = 'white';
    this.isDarkSidebar = false;
    localStorage.setItem('choose_logoheader', 'logo-white');
    localStorage.setItem('choose_skin', 'theme-white');
    localStorage.setItem('theme', theme);
  }

  enableDarkMode(): void {
    const theme = 'dark';
    this.renderer.removeClass(this.document.body, 'menu_light');
    this.renderer.removeClass(this.document.body, 'logo-white');
    this.renderer.addClass(this.document.body, 'menu_dark');
    this.renderer.addClass(this.document.body, 'logo-black');

    this.renderer.removeClass(this.document.body, 'light');
    this.renderer.removeClass(this.document.body, 'submenu-closed');
    this.renderer.removeClass(this.document.body, 'menu_light');
    this.renderer.removeClass(this.document.body, 'logo-white');
    if (localStorage.getItem('choose_skin')) {
      this.renderer.removeClass(
        this.document.body,
        localStorage.getItem('choose_skin') ?? 'light'
      );
      this.renderer.addClass(this.document.body, 'theme-black');
    }
    this.renderer.addClass(this.document.body, 'dark');
    this.renderer.addClass(this.document.body, 'submenu-closed');
    this.renderer.addClass(this.document.body, 'menu_dark');
    this.renderer.addClass(this.document.body, 'logo-black');
    this.selectedBgColor = 'black';
    this.isDarkSidebar = true;
    localStorage.setItem('choose_logoheader', 'logo-black');
    localStorage.setItem('choose_skin', 'theme-black');
    localStorage.setItem('theme', theme);
  }

}
