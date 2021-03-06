import { Component, OnInit, HostListener } from '@angular/core';

declare const $: any;
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
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  restrictedMenuItems: any[];
  innerWidth = 1024;

  constructor() {}

  @HostListener('window:resize')
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.restrictedMenuItems = RESTRICTED_ROUTES.filter(menuItem => menuItem);
  }

  isMobileMenu() {
    if (this.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
