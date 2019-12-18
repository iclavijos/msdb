import { Route, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../shared';

import { Calendar } from './calendar.component';

export const CalendarRoute: Route = {
  path: 'calendar',
  component: Calendar,
  data: {
    pageTitle: 'motorsportsDatabaseApp.calendar.title'
  },
  canActivate: [UserRouteAccessService]
};

let CALENDAR_ROUTES = [CalendarRoute];

export const calendarState: Routes = [
  {
    path: '',
    children: CALENDAR_ROUTES
  }
];
