import { Component, OnInit, HostListener } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/driver', title: 'Driver', icon: 'person', class: '' },
  { path: '/user-profile', title: 'Race track', icon: 'person', class: '' },
  { path: '/table-list', title: 'Team', icon: 'content_paste', class: '' },
  { path: '/typography', title: 'Engine', icon: 'library_books', class: '' }
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
