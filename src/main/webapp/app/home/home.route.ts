import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
// import { HomeEntriesComponent } from './home-entries.component';
// import { HomeEventsComponent } from './home-events.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    authorities: [],
    pageTitle: 'home.title'
  }
};
