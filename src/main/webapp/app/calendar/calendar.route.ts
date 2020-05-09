import { Route } from '@angular/router';

import { CalendarComponent } from './calendar.component';

export const calendarRoute: Route = {
  path: '',
  component: CalendarComponent,
  data: {
    pageTitle: 'motorsportsDatabaseApp.calendar.title'
  }
};
