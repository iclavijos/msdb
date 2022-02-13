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
  level1Menu = '';
  level2Menu = '';
  level3Menu = '';
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight!: string;
  listMaxWidth!: string;
  headerHeight = 60;
  routerObj: Subscription = new Subscription();
  currentRoute!: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private router: Router
  ) {
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // logic for select active menu in dropdown
        const currenturl = event.url.split('?')[0];
        this.level1Menu = currenturl.split('/')[1];
        this.level2Menu = currenturl.split('/')[2];

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
}
