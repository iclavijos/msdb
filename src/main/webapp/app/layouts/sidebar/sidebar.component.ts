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
  { path: '/racetrack', title: 'global.menu.entities.racetrack', icon: '', iconClass: 'icofont icofont-whistle', class: '' },
  { path: '/team', title: 'global.menu.entities.team', icon: '', iconClass: 'icofont icofont-workers-group', class: '' },
  { path: '/engine', title: 'global.menu.entities.engine', icon: '', iconClass: 'icofont icofont-whistle', class: '' },
  { path: '/chassis', title: 'global.menu.entities.chassis', icon: '', iconClass: 'icofont icofont-racing-car', class: '' },
  { path: '/tyre-provider', title: 'global.menu.entities.tyreProvider', icon: '', iconClass: 'icofont icofont-lemon-alt', class: '' },
  { path: '/fuel-provider', title: 'global.menu.entities.fuelProvider', icon: '', iconClass: 'icofont icofont-glue-oil', class: '' },
  { path: '/event', title: 'global.menu.entities.event', icon: '', iconClass: 'icofont icofont-racing-flag-alt', class: '' },
  { path: '/series', title: 'global.menu.entities.series', icon: '', iconClass: 'icofont icofont-trophy', class: '' }
];

@Component({
  selector: 'jhi-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  innerWidth = 1024;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (this.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
