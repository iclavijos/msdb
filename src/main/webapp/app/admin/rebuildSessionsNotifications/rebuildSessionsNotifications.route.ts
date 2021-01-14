import { Route } from '@angular/router';

import { JhiRebuildSessionsNotificationsComponent } from './rebuildSessionsNotifications.component';

export const rebuildSessionsNotificationsRoute: Route = {
  path: '',
  component: JhiRebuildSessionsNotificationsComponent,
  data: {
    pageTitle: 'global.menu.admin.rebuildSessionsNotif'
  }
};
