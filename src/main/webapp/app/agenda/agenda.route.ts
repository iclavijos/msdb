import { Route } from '@angular/router';

import { AgendaComponent } from './agenda.component';

export const AGENDA_ROUTE: Route = {
  path: '',
  component: AgendaComponent,
  data: {
    pageTitle: 'motorsportsDatabaseApp.agenda.title'
  }
};
